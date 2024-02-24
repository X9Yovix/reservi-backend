const express = require("express")
const dotenv = require("dotenv")
const process = require("process")
const cors = require("cors")
const usersRouter = require("./routes/users")

dotenv.config()
const port = process.env.PORT

const app = express()
app.listen(port)

app.use(cors())
app.use(express.json())

const apiRouter = express.Router()
apiRouter.use("/users", usersRouter)

app.use("/api", apiRouter)
