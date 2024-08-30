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

let conversation = [];
conversation.push(INITIAL_MESSAGE);

router.get("/", (req, res) => {
  res.send("test prompts route");
});

router.post("/conversation", async (req, res) => {
  try {
    console.log(req.body);
    conversation.push({
      role: "user",
      content: req.body.messagePrompt,
    });
    console.log(conversation);

    const response = await openai.chat.completions.create({
      messages: conversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });

    INITIAL_MESSAGE.content = `${response.choices[0].message.content} \nYou:`;
    console.log("RESPONSE");
    console.log(response);
    console.log(response.choices[0].message);

    conversation.push(response.choices[0].message);

    return res.status(200).json({
      success: true,
      data: response.choices[0].message,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on the server",
    });
  }
});

router.get("/conversation", async (req, res) => {
  console.log(conversation);
  res.status(200).json({ conversation: conversation });
});

router.get("/healthScore", async (req, res) => {
  try {
    // console.log(req.body);
    let tmpConversation = structuredClone(conversation);
    tmpConversation.push({
      role: "user",
      content: HEALTH_SCORE_MESSAGE,
    });
    console.log(tmpConversation);
    const response = await openai.chat.completions.create({
      // messages: [{ role: "system", content: req.body.messagePrompt }],
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });
    INITIAL_MESSAGE["content"] = `${response.choices[0].message.content} \nYou:`;

    console.log("RESPONSE");
    console.log(response);
    console.log(response.choices[0].message);
    let healthScore = JSON.parse(response.choices[0].message.content);
    // conversation.push(response.choices[0].message)

    return res.status(200).json({
      success: true,
      data: healthScore,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on the server",
    });
  }
});

router.get("/userInfo", async (req, res) => {
  try {
    // console.log(req.body);
    let tmpConversation = structuredClone(conversation);
    tmpConversation.push({
      role: "user",
      content: USER_DESCRIPTION_MESSAGE,
    });
    console.log(tmpConversation);
    const response = await openai.chat.completions.create({
      // messages: [{ role: "system", content: req.body.messagePrompt }],
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });
    INITIAL_MESSAGE["content"] = `${response.choices[0].message.content} \nYou:`;

    console.log("RESPONSE");
    console.log(response);
    console.log(response.choices[0].message);
    let userInfo = JSON.parse(response.choices[0].message.content);
    conversation.push(response.choices[0].message);

    return res.status(200).json({
      success: true,
      data: userInfo,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on the server",
    });
  }
});

router.get("/generateImage", async (req, res) => {
  try {
    let tmpConversation = structuredClone(conversation);
    tmpConversation.push({
      role: "user",
      content: IMAGE_GENERATION_PROMPT,
    });
    console.log(tmpConversation);
    const response = await openai.chat.completions.create({
      // messages: [{ role: "system", content: req.body.messagePrompt }],
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });
    //Ciao, sono Manfredi ho 28 anni e sono un uomo di 1,80m e peso 75kg.
    console.log("RESPONSE");
    console.log(response);
    console.log(response.choices[0].message);
    let imageDescription = response.choices[0].message.content;
    let imageDescritionForApi = imageDescription;
    //additional filters for image prompt specificity
    imageDescription =
      imageDescription +
      ` considera questi stili:
            photo, photograph, raw photo,analog photo, 4k, fujifilm photograph.
            non includere scritte, frasi o vignette di alcun tipo `;

    const response2 = await openai.images.generate({
      model: OPENAI_MODEL_IMAGE_GENERATION,
      prompt: imageDescription ? imageDescription : "a white siamese cat",
      n: 1,
      size: "1024x1024",
    });
    let image_url = response2.data[0].url;
    console.log(image_url);
    return res.status(200).json({
      success: true,
      data: {
        image_url: image_url,
        description: imageDescritionForApi,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on the server",
    });
  }
});

module.exports = router;
