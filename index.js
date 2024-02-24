const express = require("express")
const dotenv = require("dotenv")
const process = require("process")
const cors = require("cors")
const swaggerUI = require("swagger-ui-express")
const swaggerSpec = require("./swagger")

const usersRouter = require("./routes/users")

dotenv.config()
const port = process.env.PORT

const app = express()
app.listen(port)

app.use(cors())
app.use(express.json())

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

const apiRouter = express.Router()
apiRouter.use("/users", usersRouter)

app.use("/api", apiRouter)
