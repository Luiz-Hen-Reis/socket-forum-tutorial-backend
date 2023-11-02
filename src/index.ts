import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { connect } from "./database";
import http from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { Topic } from "./models/Topic";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use(routes);

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("join_room", ({ name, topicId }) => {
    socket.join(topicId);

    const systemMessage = {
      _id: new mongoose.Types.ObjectId(),
      content: `${name} joined the room`,
      createdAt: new Date(),
    };

    io.to(topicId).emit("new_message", systemMessage);
  });

  socket.on("send_message", async ({ content, author, topicId }) => {
    const topic = await Topic.findById(topicId);

    const message = {
      _id: new mongoose.Types.ObjectId(),
      content,
      author,
      createdAt: new Date(),
    };

    topic?.messages.push(message);
    await topic?.save();

    io.to(topicId).emit("new_message", message);
  });

  socket.on("leave_room", ({ name, topicId }) => {
    socket.leave(topicId);

    const systemMessage = {
      _id: new mongoose.Types.ObjectId(),
      content: `${name} exited the room`,
      createdAt: new Date(),
    };

    io.to(topicId).emit("new_message", systemMessage);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

connect();

server.listen(3000, () => console.log("application started on localhost:3000"));
