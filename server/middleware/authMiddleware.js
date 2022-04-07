const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("token");

  // Check if token exist
  if (!token) {
    return res.status(401).json({ msg: "Access denied" });
  }

  // Verify the token
  try {
    jwt.verify(token, process.env.jwtSecret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Invalid token" });
      } else {
        req.user = decoded.userId;
        next();
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};