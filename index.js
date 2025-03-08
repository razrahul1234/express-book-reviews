require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');

//db connection
require('./config/db');

// route config
const routes = require("./routes");
app.use("/api", routes);

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.use((err, req,res,next) => {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
        error:{
            message: err.message,
            status:err.status || 500
        }
    });
})

app.get('/', (req,res,next) => {
    res.send("Welcome to the Express!")
})

app.listen(port, () => {
    console.log(`server started at PORT ${port}`)
})