require('dotenv').config();
const mongoose = require("mongoose");

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run(){
    try{
        await mongoose.connect(process.env.uri, clientOptions);
        await mongoose.connection.db.admin().command({ping:1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally{
        // await mongoose.disconnect();
        console.log("DB CONNECTED");
    } 
}

run().catch(console.dir);



// //2nd Version
// const mongoose = require('mongoose');

// const uri = process.env.uri;

// Connect to MongoDB
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');

//     // Send a ping command to the MongoDB server
//     mongoose.connection.db.admin().command({ ping: 1 })
//       .then((result) => {
//         console.log('Ping result:', result);
//       })
//       .catch((err) => {
//         console.error('Ping failed:', err);
//       });
//   })
//   .catch((err) => {
//     console.error('Connection error:', err);
//   });

// // Handle connection errors
// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });
