const jwt = require("jsonwebtoken")

const authenticateJwt = (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) {
    return res.status(401).json({
      error: "Unauthorized - No token provided"
    })
  } else {
    var jwtToken = token.split(" ")[1]
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Error verifying token", err)
        return res.status(403).json({
          error: "Forbidden - Invalid token"
        })
      }
      req.user = decoded
      next()
    })
  }
}

const isAdmin = (req, res, next) => {
  const { role } = req.user
  if (role !== "admin") {
    return res.status(403).json({
      error: "Forbidden - Access for admin only"
    })
  }
  next()
}

module.exports = {
  authenticateJwt,
  isAdmin
}
