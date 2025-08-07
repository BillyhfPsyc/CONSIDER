// connect.js
// Import the MongoClient class and ServerApiVersion object from the MongoDB library.
const { MongoClient, ServerApiVersion } = require('mongodb');

// The connection URI (Uniform Resource Identifier) for MongoDB is stored in the .env file.
// This URI contains the address of the database server and authentication details (like username and password).

// Create a MongoClient instance to connect to the MongoDB database.
// The MongoClientOptions object is used to configure the connection settings.
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1, // Specifies the version of the MongoDB API to use (v1 is the stable version).
    strict: true, // Enables strict mode, which ensures the API behaves predictably.
    deprecationErrors: true, // Makes the program throw errors if deprecated features are used.
  }
});

// Declare a variable to store the database object once the connection is established.
// This variable will be used to interact with the database.
let database;

// Export two functions so other parts of the application can use them to connect to the database and access it.
module.exports = {
    // Function to connect to the database.
    // This function sets up a connection to the "Test" database and stores the database object in the `database` variable.
    connectToServer: () => {
        database = client.db("Test"); // Connect to the "Test" database.
    }, 
    // Function to get the database object.
    // This function returns the database object so other parts of the application can use it to interact with the database.
    getDB: () => {
        return database; // Return the database object.
    }
} // --> basically, anything specified in the module.exports field can be imported to another file via keyword 'require'. 

// console.log("I be here, I be sentient.")









// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
