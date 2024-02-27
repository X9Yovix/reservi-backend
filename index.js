const express = require("express")
const dotenv = require("dotenv")
const process = require("process")
const cors = require("cors")
const swaggerUI = require("swagger-ui-express")
const swaggerSpec = require("./swagger")
const connectDB = require("./config/db_config")
const authMiddleware = require("./middleware/auth_middleware")

const usersRouter = require("./routes/users")
const authsRouter = require("./routes/auths")

dotenv.config()
const port = process.env.PORT

const app = express()

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  })

app.use(cors())
app.use(express.json())

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

const apiRouter = express.Router()
apiRouter.use("/users", authMiddleware, usersRouter)
apiRouter.use("/auths", authsRouter)

app.use("/api", apiRouter)
