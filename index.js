const express = require("express");
const dotenv = require('dotenv'); 
const process = require('process');

dotenv.config(); 
const port = process.env.PORT; 

const app = express();
app.listen(port);

app.get("/", (req, res) => {
  res.send("App is working");
});