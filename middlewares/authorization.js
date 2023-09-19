const jwt = require('jsonwebtoken');

const verifyToken = (req,res, next) => {
  const token = req.headers.token || req.body.token || req.params.token || req.query.token;

  if (!token) {
    return res.status(401).json({
      result:false,
      message: "Authentication error: Token missing" 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        result:false,
        message:err.message  
      });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;
