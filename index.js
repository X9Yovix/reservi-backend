const express = require("express")
const dotenv = require("dotenv")
const process = require("process")
const cors = require("cors")

dotenv.config()
const port = process.env.PORT

const app = express()
app.listen(port)

app.use(cors())

app.get("/", (req, res) => {
  res.send("App is working")
})
