const express = require("express");
const router = express.Router();
const genAI = require("../server.js"); // null when GEMINI_API_KEY is not set (demo mode)
const {
  GEMINI_MODEL_TEXT,
  GEMINI_MODEL_IMAGE,
  IMAGE_GENERATION_PROMPT,
  INITIAL_MESSAGE,
  HEALTH_SCORE_MESSAGE,
  USER_DESCRIPTION_MESSAGE,
} = require("../constants.js");
const { cleanResponseString, parseAndCleanObject } = require("../utils.js");
const {
  DEMO_STREAM_RESPONSES,
  DEMO_USER_INFO,
  DEMO_HEALTH_SCORES,
  DEMO_IMAGE_URL,
  streamText,
} = require("../mock/demo.js");

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

// Build a Gemini-format history from the OpenAI-format session conversation.
// conversation[0] is the system instruction (handled via systemInstruction), so skip it.
// skipLast: true when the last message is the one we're about to send (stream/conversation routes).
function toGeminiHistory(conversation, skipLast = false) {
  const slice = skipLast ? conversation.slice(1, -1) : conversation.slice(1);
  return slice.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
}

function getTextModel() {
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL_TEXT,
    systemInstruction: INITIAL_MESSAGE.content,
  });
}

router.get("/", (req, res) => {
  res.send("prompts route ok");
});

// Non-streaming chat
router.post("/conversation", async (req, res) => {
  try {
    const session = getSession(getSessionId(req));
    const userContent = req.body.messagePrompt + " Always format your response in HTML as it will be inserted into an innerHTML.";
    session.conversation.push({ role: "user", content: userContent });

    const model = getTextModel();
    const chat = model.startChat({ history: toGeminiHistory(session.conversation, true) });
    const result = await chat.sendMessage(userContent);
    const responseText = result.response.text();

    session.conversation.push({ role: "assistant", content: responseText });
    return res.status(200).json({ success: true, data: { role: "assistant", content: responseText } });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "There was an issue on the server." });
  }
});

// Streaming chat — sends tokens as Server-Sent Events
router.post("/stream", async (req, res) => {
  const session = getSession(getSessionId(req));
  const userContent = req.body.messagePrompt + " Always format your response in HTML as it will be inserted into an innerHTML.";
  session.conversation.push({ role: "user", content: userContent });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  if (!genAI) {
    const exchangeIndex = Math.max(0, Math.floor((session.conversation.length - 2) / 2));
    const text = DEMO_STREAM_RESPONSES[Math.min(exchangeIndex, DEMO_STREAM_RESPONSES.length - 1)];
    await streamText(res, text);
    session.conversation.push({ role: "assistant", content: text });
    res.write("data: [DONE]\n\n");
    res.end();
    return;
  }

  try {
    const model = getTextModel();
    const chat = model.startChat({ history: toGeminiHistory(session.conversation, true) });
    const result = await chat.sendMessageStream(userContent);

    let fullContent = "";
    for await (const chunk of result.stream) {
      const delta = chunk.text();
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
  const session = getSession(getSessionId(req));

  if (!genAI) {
    const exchangeIndex = Math.max(0, Math.floor((session.conversation.length - 2) / 2));
    const score = DEMO_HEALTH_SCORES[Math.min(exchangeIndex, DEMO_HEALTH_SCORES.length - 1)];
    return res.status(200).json({ success: true, data: { healthScore: score } });
  }

  try {
    const model = getTextModel();
    const contents = [
      ...toGeminiHistory(session.conversation),
      { role: "user", parts: [{ text: HEALTH_SCORE_MESSAGE }] },
    ];

    const result = await model.generateContent({ contents });
    const healthScore = JSON.parse(cleanResponseString(result.response.text()));
    return res.status(200).json({ success: true, data: healthScore });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "There was an issue on the server." });
  }
});

router.get("/userInfo", async (req, res) => {
  const session = getSession(getSessionId(req));

  if (!genAI) {
    session.userInfo = DEMO_USER_INFO;
    return res.status(200).json({ success: true, data: DEMO_USER_INFO });
  }

  try {
    const model = getTextModel();
    const userDescPrompt = USER_DESCRIPTION_MESSAGE +
      (session.userInfo != null
        ? `Consider the previously generated object and expand it by adding new properties and updating existing ones: ${JSON.stringify(session.userInfo)}.`
        : "");

    const contents = [
      ...toGeminiHistory(session.conversation),
      { role: "user", parts: [{ text: userDescPrompt }] },
    ];

    const result = await model.generateContent({ contents });
    const text = cleanResponseString(result.response.text());
    const cleanedResponseObj = parseAndCleanObject(JSON.parse(text));

    session.userInfo = cleanedResponseObj;
    session.conversation.push({ role: "assistant", content: text });

    return res.status(200).json({ success: true, data: session.userInfo });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "There was an issue on the server." });
  }
});

router.get("/generateImage", async (req, res) => {
  const session = getSession(getSessionId(req));

  if (!genAI) {
    return res.status(200).json({
      success: true,
      data: {
        image_url: DEMO_IMAGE_URL,
        description: "Demo avatar — connect a Gemini API key to generate a personalised AI avatar.",
      },
    });
  }

  try {
    // Step 1: generate a textual image description using the chat model
    const textModel = getTextModel();
    const descPrompt = IMAGE_GENERATION_PROMPT +
      (session.tmpImageParagraph != null
        ? `Use this previously generated description as a style guideline: "${session.tmpImageParagraph}".`
        : "");

    const descResult = await textModel.generateContent({
      contents: [
        ...toGeminiHistory(session.conversation),
        { role: "user", parts: [{ text: descPrompt }] },
      ],
    });
    const imageDescription = cleanResponseString(descResult.response.text());
    session.tmpImageParagraph = imageDescription;

    const imagePrompt = imageDescription + " No text, no writing, no speech bubbles, image only.";

    // Step 2: generate the image
    const imageModel = genAI.getGenerativeModel({ model: GEMINI_MODEL_IMAGE });
    const imageResult = await imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: imagePrompt }] }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    });

    const parts = imageResult.response.candidates[0].content.parts;
    const imagePart = parts.find(p => p.inlineData);
    if (!imagePart) throw new Error("No image returned from Gemini");

    const dataUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    return res.status(200).json({
      success: true,
      data: { image_url: dataUrl, description: imageDescription },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, error: "There was an issue on the server." });
  }
});

module.exports = router;
