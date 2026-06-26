const express = require("express");
const router = express.Router();
const openai = require("../server.js");
const {
  OPENAI_MODEL_TEXT_GENERATION,
  OPENAI_MODEL_IMAGE_GENERATION,
  IMAGE_GENERATION_PROMPT,
  INITIAL_MESSAGE,
  HEALTH_SCORE_MESSAGE,
  USER_DESCRIPTION_MESSAGE,
} = require("../constants.js");
const { cleanResponseString, parseAndCleanObject } = require("../utils.js");

// Per-session state: sessionId → { conversation, userInfo, tmpImageParagraph }
const sessions = new Map();

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      conversation: [{ role: INITIAL_MESSAGE.role, content: INITIAL_MESSAGE.content }],
      userInfo: null,
      tmpImageParagraph: null,
    });
  }
  return sessions.get(sessionId);
}

function getSessionId(req) {
  return req.headers['x-session-id'] || 'default';
}

router.get("/", (req, res) => {
  res.send("prompts route ok");
});

router.post("/conversation", async (req, res) => {
  try {
    const session = getSession(getSessionId(req));
    session.conversation.push({
      role: "user",
      content: req.body.messagePrompt + " Always format your response in HTML as it will be inserted into an innerHTML.",
    });

    const response = await openai.chat.completions.create({
      messages: session.conversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });

    session.conversation.push(response.choices[0].message);

    return res.status(200).json({ success: true, data: response.choices[0].message });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "There was an issue on the server." });
  }
});

// Streaming endpoint — sends tokens as Server-Sent Events
router.post("/stream", async (req, res) => {
  const session = getSession(getSessionId(req));
  session.conversation.push({
    role: "user",
    content: req.body.messagePrompt + " Always format your response in HTML as it will be inserted into an innerHTML.",
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const stream = await openai.chat.completions.create({
      messages: session.conversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
      stream: true,
    });

    let fullContent = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        fullContent += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }

    session.conversation.push({ role: "assistant", content: fullContent });
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ error: "Stream failed." })}\n\n`);
    res.end();
  }
});

router.get("/conversation", (req, res) => {
  const session = getSession(getSessionId(req));
  res.status(200).json({ conversation: session.conversation });
});

router.delete("/conversation", (req, res) => {
  sessions.delete(getSessionId(req));
  res.status(200).json({ success: true });
});

router.get("/healthScore", async (req, res) => {
  try {
    const session = getSession(getSessionId(req));
    const tmpConversation = structuredClone(session.conversation);
    tmpConversation.push({ role: "user", content: HEALTH_SCORE_MESSAGE });

    const response = await openai.chat.completions.create({
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });

    const healthScore = JSON.parse(response.choices[0].message.content);
    return res.status(200).json({ success: true, data: healthScore });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "There was an issue on the server." });
  }
});

router.get("/userInfo", async (req, res) => {
  try {
    const session = getSession(getSessionId(req));
    const tmpConversation = structuredClone(session.conversation);
    tmpConversation.push({
      role: "user",
      content:
        USER_DESCRIPTION_MESSAGE +
        (session.userInfo != null
          ? `Consider the previously generated object and expand it by adding new properties and updating existing ones: ${JSON.stringify(session.userInfo)}.`
          : ""),
    });

    const response = await openai.chat.completions.create({
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });

    const cleanedResponseObj = parseAndCleanObject(
      JSON.parse(cleanResponseString(response.choices[0].message.content))
    );

    session.userInfo = cleanedResponseObj;
    session.conversation.push(response.choices[0].message);

    return res.status(200).json({ success: true, data: session.userInfo });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "There was an issue on the server." });
  }
});

router.get("/generateImage", async (req, res) => {
  try {
    const session = getSession(getSessionId(req));
    const tmpConversation = structuredClone(session.conversation);
    tmpConversation.push({
      role: "user",
      content:
        IMAGE_GENERATION_PROMPT +
        (session.tmpImageParagraph != null
          ? `Use this previously generated description as a style guideline: "${session.tmpImageParagraph}".`
          : ""),
    });

    const response = await openai.chat.completions.create({
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });

    const cleanedImageDescription = cleanResponseString(response.choices[0].message.content);
    session.tmpImageParagraph = cleanedImageDescription;

    const imagePrompt = cleanedImageDescription + " No text, no writing, no speech bubbles, image only.";

    const response2 = await openai.images.generate({
      model: OPENAI_MODEL_IMAGE_GENERATION,
      prompt: imagePrompt || "a friendly person enjoying outdoor activities",
      n: 1,
      size: "1024x1024",
    });

    return res.status(200).json({
      success: true,
      data: {
        image_url: response2.data[0].url,
        description: cleanedImageDescription,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "There was an issue on the server." });
  }
});

module.exports = router;
