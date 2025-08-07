// This file starts and configures the backend server for the app. 
// It sets up Express (a web server), connects to the MongoDB database, 
// and wires in other files that define how the app should respond to different types of requests — 
// like handling chats or saving posts. This file doesn't contain the logic for those features itself, 
// but it connects everything together and gets the server running so that the rest of the app can work.


require("dotenv").config({ path: "./config.env" });  // ← load your env here

const connect = require("./connect.js");
// makes a new variable called connect, and this 'require' connects this to the module.exports stuff, like import/exporting a function.
const express = require("express"); // this is like saying "Hey Node, I want to use this tool called Express in my code."

const cors = require("cors");

const chatRoutes = require("./chatRoutes");
const posts = require("./postRoutes.js");
// imports the connect.js file to establish a connection to the MongoDB database.
// this stuff overallnbasically imports these libraries.


const app = express();
// creates a new express application instance, which is used to handle HTTP requests and responses.
const PORT = 3001 // url thingy

app.use(cors());
app.use(express.json());
// app.use() is a method to mount middleware functions at the specified path.
// cors() is a middleware function that enables Cross-Origin Resource Sharing, allowing the server to accept requests from different origins.
// express.json() is a middleware function that parses incoming JSON requests and makes the data available in req.body, ensuring the format of the data is json.

app.use(posts);
app.use(chatRoutes);
// This line mounts the chatRoutes middleware to handle chat-related requests.

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connect.connectToServer(); // calls the connectToServer function to establish a connection to the MongoDB database.
    console.log("Connected to MongoDB");
}) // listens for incoming requests on the specified port (3001 in this case).

// Simple health check endpoint to verify server is running and routes are reachable
// app.get("/ping", (req, res) => {
//     return res.json({ pong: true });
//   });


