const jwt = require("jsonwebtoken")

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" })
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Error verifying token", err)
        return res.status(403).json({ error: "Forbidden - Invalid token" })
      }
      req.user = decoded
      next()
    })
  }
}

module.exports = authenticateJWT
