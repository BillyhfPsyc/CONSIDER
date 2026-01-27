// connect.js
// Import the MongoClient class and ServerApiVersion object from the MongoDB library.
const { MongoClient, ServerApiVersion } = require('mongodb');

require("dotenv").config({ path: "./config.env" });  // ← load your env here
// ({ path: "./config.env" }); --> can add this but as Env vars are injected directly in Render, not needed there

// Create a MongoClient instance to connect to the MongoDB database.
// The MongoClientOptions object is used to configure the connection settings.
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1, // Specifies the version of the MongoDB API to use (v1 is the stable version).
    strict: true, // Enables strict mode, which ensures the API behaves predictably.
    deprecationErrors: true, // Makes the program throw errors if deprecated features are used.
  }
});

let database;

async function connectToServer() {
  if (database) return database;      // already connected
  await client.connect();             // <-- THIS is the key line
  database = client.db("Consider");
  console.log("✅ Connected to MongoDB");
  return database;
}

function getDB() {
  if (!database) throw new Error("Database not initialized. Call connectToServer() first.");
  return database;
}

module.exports = { connectToServer, getDB };
