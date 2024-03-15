const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    const name = file.originalname.toLowerCase().split(" ").join("-")
    cb(null, Date.now() + "-" + name)
  }
})

module.exports = multer({ storage: storage })
