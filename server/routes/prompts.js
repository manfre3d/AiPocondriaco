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

let conversation = [];
let tmpImageParagraph = null;
let userInfo = null;
conversation.push(INITIAL_MESSAGE);

router.get("/", (req, res) => {
  res.send("test prompts route");
});

router.post("/conversation", async (req, res) => {
  try {
    console.log(req.body);
    conversation.push({
      role: "user",
      content:
        req.body.messagePrompt +
        ` Considera sempre che il testo che generi verrà inserito all'interno di un innerHTML 
        quindi deve essere SEMPRE formattato in html`,
    });
    console.log(conversation);

    const response = await openai.chat.completions.create({
      messages: conversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });

    let cleanedMessage = cleanResponseString(
      response.choices[0].message.content
    ); 
    INITIAL_MESSAGE.content = `${cleanedMessage} \nYou:`;
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
    let tmpConversation = structuredClone(conversation);
    tmpConversation.push({
      role: "user",
      content: HEALTH_SCORE_MESSAGE,
    });
    console.log(tmpConversation);
    const response = await openai.chat.completions.create({
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });
    INITIAL_MESSAGE[
      "content"
    ] = `${response.choices[0].message.content} \nYou:`;

    console.log("RESPONSE");
    console.log(response);
    console.log(response.choices[0].message.content);
    let healthScore = JSON.parse(response.choices[0].message.content);

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
    let tmpConversation = structuredClone(conversation);
    tmpConversation.push({
      role: "user",
      content:
        USER_DESCRIPTION_MESSAGE + userInfo != null
          ? `Prendi in considerazione l'oggetto precedentemente generato e espandilo aggiungendo nuove proprietà,
            aggiornando le vecchie proprietà e traducendo i nomi di queste proprietà in italiano: 
            ${JSON.stringify(userInfo)}.
            considera che punteggioSalute corrisponde a healthScore tradotto in italiano, quindi prenditi cura di
            aggiornare questo valore all'ultima versione nella conversazione.
            Includi sempre nella risposta solo l'oggetto JSON, senza fornire informazioni aggiuntive. 
            Considera che il contenuto della tua risposta verrà elaborato 
            dal metodo JSON.parse().`
          : "",
    });
    console.log(tmpConversation);
    const response = await openai.chat.completions.create({
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });
    let cleanedResponseObj = parseAndCleanObject(
      JSON.parse(
        cleanResponseString(response.choices[0].message.content)
      )
    );
    INITIAL_MESSAGE[
      "content"
    ] = `${cleanedResponseObj} \nYou:`;

    console.log("RESPONSE");
    console.log(response);
    console.log(response.choices[0].message);
    console.log(cleanedResponseObj);

    userInfo = cleanedResponseObj;
    console.log(userInfo);
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
      content:
        IMAGE_GENERATION_PROMPT +
        (tmpImageParagraph = !null
          ? `Considera che questo: "${tmpImageParagraph}" è il testo che hai generato in precedenza, 
            usalo come linea guida per il nuovo paragrafo.`
          : ""),
    });
    console.log(tmpConversation);
    const response = await openai.chat.completions.create({
      messages: tmpConversation,
      model: OPENAI_MODEL_TEXT_GENERATION,
    });

    let cleanedImageDescription = cleanResponseString(
      response.choices[0].message.content
    ); 
    let imageDescription = cleanedImageDescription;
    tmpImageParagraph = imageDescription;
    console.log(`image paragraph : ${tmpImageParagraph}`);
    let imageDescritionForApi = imageDescription;

    imageDescription += ` non includere scritte, frasi o vignette di alcun tipo, image only without typography`;
    console.log(`imageDescription ${imageDescription}`);
    const response2 = await openai.images.generate({
      model: OPENAI_MODEL_IMAGE_GENERATION,
      prompt: imageDescription ? imageDescription : "a white siamese cat",
      n: 1,
      size: "1024x1024",
    });
    let image_url = response2.data[0].url;
    console.log(image_url);
    console.log(imageDescritionForApi);

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
