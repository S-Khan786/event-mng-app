import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import Event from "./models/Event.js"; // Import Event model
import path from 'path';


const __dirname = path.resolve();

const app = express();

dotenv.config();

// CORS middleware configuration to allow WebSocket connections
const corsOptions = {
  origin: "http://localhost:5173", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions)); // Apply the CORS middleware


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL for WebSocket
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies, headers)
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Add socket to eventRoutes
app.use((req, res, next) => {
  req.io = io; // Make the io instance available in the routes
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("updateAttendees", async (eventId) => {
    try {
      const event = await Event.findById(eventId).populate(
        "attendees",
        "username"
      );
      console.log("Emitting attendeeUpdate for event:", eventId);
      io.emit("attendeeUpdate", { eventId, attendees: event.attendees });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
