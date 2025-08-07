// creating http routes so our frontend can communicate with our backend
// remember, the frontend sends requestst to the backend, and the backend sends responses back to the frontend
// we do that by setting up routes in the backend, which are like endpoints that the frontend can hit to get data or send data to the backend

// the backend is always running and awaits requests from the frontned calling a specific route.
// then, when it gets a specific route request it will run the associated functions with that route, returning the results to the frontend.

// note that every backend route should just do one thing, and not do multiple things.
// also, note that front end routes (react-router) and back end routes (express) are completely unrelated. 
// the former returns webpages, the latter returns json data.
const express = require("express");
const database = require("./connect.js"); 
const ObjectId = require("mongodb").ObjectId; // imports the ObjectId class from the mongodb library, which is used to create unique identifiers for MongoDB documents.
// this allows us to create and manipulate MongoDB ObjectIds, which are used as unique identifiers for documents in a MongoDB collection.

let postRoutes = express.Router(); // creates a new router object, which is used to define routes for handling HTTP requests.

// what routes do we want in our code?

//#1 - Retrieve All - use get method to get info.
// below, the request parameter allows us to pass specific arguments when calling this route, with the response being the object returned to the client when the thingy is complete. 
postRoutes.route("/posts").get(async (request, response) => {
    let db = database.getDB(); // gets the database object from the connect.js file, which allows us to interact with the MongoDB database.
    let data = await db.collection("posts").find({}).toArray(); // accesses the "posts" collection in the database and retrieves all documents in that collection.
    if (data.length>0) {
        response.json(data); // if data is found, it sends the data back to the client in JSON format.
    } else {
        throw new Error("Data was not found:(");
    }
}) // the async and await stuff ensures that the data completes processing before moving on.
//#2 - Retrieve One
// the colon below infers that the id is a variable that will be passed in the request URL, allowing us to retrieve a specific post by its ID.
postRoutes.route("/posts/:id").get(async (request, response) => {
    let db = database.getDB(); // gets the database object from the connect.js file, which allows us to interact with the MongoDB database.
    let data = await db.collection("posts").findOne({_id: new ObjectId(request.params.id)}); // accesses the "posts" collection in the database and retrieves just one document based on the ID passed in the request URL. Note that this ID at the end must match the ID of a post in the database (after the colon in the URL).
    if (Object.keys(data).length>0) { // checking for empty object instead of empty array, since findOne returns an object.
        response.json(data); // if data is found, it sends the data back to the client in JSON format.
    } else {
        throw new Error("Data was not found:(");
    }
})
//#3 - Create One
// Doesn't cause an issue having same route as above, since the method is different (post vs get).
postRoutes.route("/posts").post(async (request, response) => {
    let db = database.getDB(); // gets the database object from the connect.js file, which allows us to interact with the MongoDB database.
    let mongoObject = { // write mongo fields below aside from _id as spceified in mongocloud.
        first_message: request.body.first_message, // request.body accesses the data sent in the request body, which is expected to be in JSON format.
    }
    let data = await db.collection("posts").insertOne(mongoObject);
    response.json(data)
})

//#4 - Update One
postRoutes.route("/posts/:id").put(async (request, response) => {
    let db = database.getDB(); // gets the database object from the connect.js file, which allows us to interact with the MongoDB database.
    let mongoObject = { // write mongo fields below aside from _id as spceified in mongocloud.
        $set: {
            first_message: request.body.first_message // request.body accesses the data sent in the request body, which is expected to be in JSON format.
        }
    };
    let data = await db.collection("posts").updateOne({_id: new ObjectId(request.params.id)}, mongoObject);
    response.json(data) 
})
//#5 - Delete One
postRoutes.route("/posts/:id").delete(async (request, response) => {
    let db = database.getDB(); // gets the database object from the connect.js file, which allows us to interact with the MongoDB database.
    let data = await db.collection("posts").deleteOne({_id: new ObjectId(request.params.id)});
    response.json(data);
})


module.exports = postRoutes; // exports the postRoutes object so it can be used in other files, allowing the defined routes to be accessible in the main server file or wherever needed.
