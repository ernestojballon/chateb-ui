// server.js or routes/chat.js
import express from "express";
import axios from "axios";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Chat from "../models/chat.js";
import model from "../lib/gemini.js";

const router = express.Router();


// Streaming endpoint for chat messages
router.post("/stream/:chatId", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const chatId = req.params.chatId;
  const { text ,imageUrl} = req.body;

  try {
    // Get the chat to check ownership and get history
    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const imageData = await axios.get(process.env.IMAGE_KIT_ENDPOINT + imageUrl, {
      responseType: 'arraybuffer'
    }).then(response => Buffer.from(response.data, 'binary').toString('base64')).catch(err => {
      console.error("Error fetching image:", err);
      return null;
    }
    );

    const aiData = {
      inlineData: {
        data: imageData,
        mimeType: 'image/png',
      },
    };


    
    // Format chat history
    const formattedHistory = chat.history.map(({ role, parts }) => ({
      role: role,
      parts: [{ text: parts[0].text }],
    }));

    // Create chat session
    const chatSession = model.startChat({
      history: formattedHistory,
    });

    // Send message
    const messageParts = imageUrl ? [aiData, text] : [text];
    const result = await chatSession.sendMessageStream(messageParts);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      // write accumulate text to the response stream
      res.write(`data: ${JSON.stringify({ response: chunkText })}\n\n`);
      
    }
    const response = await result.response;
    // Update database
    await Chat.updateOne(
      { _id: chatId, userId },
      {
        $push: {
          history: [
            { 
              role: "user", 
              parts: [{ text }],
              ...(imageUrl && { img: imageUrl }) 
            },
            { 
              role: "model", 
              parts: [{ text: response.text() }] 
            }
          ]
        }
      }
    );
    res.end();
  } catch (error) {
    console.error("Error in Gemini:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

export default router;