import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db";
import dotenv from "dotenv";
import { authRouter } from "./src/routes/auth";
import jobRouter from "./src/routes/job";
import { gigRouter } from "./src/routes/gig";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use((req, _res, next) => {
  (req as any).io = io;
  next();
});

app.use((req, _res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/auth", authRouter);
app.use("/jobs", jobRouter);
app.use("/gigs", gigRouter);

app.get("/", (req, res) => {
  res.send("server running");
});

httpServer.listen(8080, () => {
  console.log("server running on http://localhost:8080");
});
