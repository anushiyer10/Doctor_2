const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require('./config/db');

dotenv.config();

// mongodb connection
connectDB();


// rest object
const app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev")); // log requests to the console

// routes
app.use("/api/v1/user",require("./routes/userRoutes"));

//port
const port = 8080;


app.use('/',(req,res)=>{
  res.send({message:"Welcome to our API"})

// server start
})
// listen port
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${port}`
  );
});
