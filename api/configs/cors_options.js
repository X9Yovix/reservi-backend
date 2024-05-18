const whiteList = [process.env.FRONTEND_URL, process.env.BACKEND_URL, process.env.FRONTEND_URL_ANGULAR]

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions
