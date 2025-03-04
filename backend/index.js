import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import ImageKit from "imagekit";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import geminiRouter from "./routes/geminiRouter.js";
import chatRouter from "./routes/chatsRouter.js";
import {connectMongo} from "./db/index.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());


const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.use("/api/chats",ClerkExpressRequireAuth(),chatRouter); 

app.use("/api/gemini",ClerkExpressRequireAuth(), geminiRouter); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  connectMongo();
  console.log("Server running on 3000");
});