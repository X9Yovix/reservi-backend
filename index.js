const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const process = require("process")
const cors = require("cors")
const corsOptions = require("./api/configs/cors_options")
const swaggerUI = require("swagger-ui-express")
const swaggerSpec = require("./api/configs/swagger")
const connectDB = require("./api/configs/db_config")
const authMiddleware = require("./api/middlewares/auths")

const usersRouter = require("./api/routes/users")
const authsRouter = require("./api/routes/auths")
const meetingRoomsRouter = require("./api/routes/meeting_rooms")
const materialsRouter = require("./api/routes/materials")

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

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use(cors(corsOptions))
app.use(express.json())

const apiRouter = express.Router()

apiRouter.use("/auths", authsRouter)
apiRouter.use("/users", authMiddleware, usersRouter)
apiRouter.use("/materials", authMiddleware, materialsRouter)
apiRouter.use("/meeting_rooms", authMiddleware, meetingRoomsRouter)

app.use("/api", apiRouter)
