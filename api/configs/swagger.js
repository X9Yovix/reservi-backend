const swaggerJSDoc = require("swagger-jsdoc")

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Reservation Room API",
    version: "1.0.0",
    description: "node js api for reservation room app"
  },
  servers: [
    {
      url: "http://localhost:4000/api"
    }
  ]
}

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(options)
module.exports = swaggerSpec
