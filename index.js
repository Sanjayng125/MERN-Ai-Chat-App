import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { connectToDb } from "./backend/lib/db.js";
import {
  chat,
  getChat,
  getUserChats,
  updateChat,
} from "./backend/controllers/chat.controller.js";
import { authenticateUser } from "./backend/controllers/image.controller.js";
import path from "path";
import url, { fileURLToPath } from "url";

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

connectToDb();

app.get("/api/upload", authenticateUser);

app.post("/api/chats", ClerkExpressRequireAuth(), chat);

app.get("/api/userchats", ClerkExpressRequireAuth(), getUserChats);

app.get("/api/chats/:id", ClerkExpressRequireAuth(), getChat);

app.put("/api/chats/:id", ClerkExpressRequireAuth(), updateChat);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

// PRODUCTION
app.use(express.static(path.join(__dirname, "./client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
