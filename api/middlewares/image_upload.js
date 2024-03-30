const multer = require("multer")
const fs = require("fs")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null, "uploads/")
    /* let destinationFolder = "uploads/"
    console.log(req)
    if (req.baseUrl === "/api/register") {
      destinationFolder += "temp/"
    } else if (req.baseUrl === "/api/meeting_rooms") {
      destinationFolder += "temp/"
      destinationFolder += "meeting_rooms/" + req.body.meetingRoomId + "/"
    }

    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true })
    }

    cb(null, destinationFolder) */
    let destinationFolder = "uploads/temp/"
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true })
    }
    cb(null, destinationFolder)
  },
  filename: function (req, file, cb) {
    const name = file.originalname.toLowerCase().split(" ").join("-")
    cb(null, Date.now() + "-" + name)
  }
})

module.exports = multer({ storage: storage })
