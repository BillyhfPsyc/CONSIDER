// This file starts and configures the backend server for the app. 
// It sets up Express (a web server), connects to the MongoDB database, 
// and wires in other files that define how the app should respond to different types of requests — 
// like handling chats or saving posts. This file doesn't contain the logic for those features itself, 
// but it connects everything together and gets the server running so that the rest of the app can work.

require("dotenv").config({ path: "./config.env" });  // ← load your env here

const connect = require("./connect.js");
const express = require("express"); 
const cors = require("cors");

const chatRoutes = require("./chatRoutes");
const analysisRoutes = require("./analysisRoutes");


const app = express();
// creates a new express application instance, which is used to handle HTTP requests and responses.
const PORT = process.env.PORT || 3001; // this process bit is for when deployed publically

// CORS: set FRONTEND_ORIGIN on Render to your Vercel domain
// e.g. FRONTEND_ORIGIN=https://consider-xyz.vercel.app
// locally: FRONTEND_ORIGIN=http://localhost:5173
const allowedOrigins = [process.env.FRONTEND_ORIGIN].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Health check for Render
app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use(chatRoutes);
app.use(analysisRoutes);

// Connect to DB first, then start server
(async () => {
  try {
    await connect.connectToServer();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();