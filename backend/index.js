import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import swaprequestRoutes from "./routes/swapresquestRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api", swaprequestRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`, 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join", (userId) => socket.join(userId));
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

export { io };

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
