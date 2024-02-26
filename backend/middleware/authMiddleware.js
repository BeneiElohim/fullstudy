const jwt = require('jsonwebtoken');
const JWT_SECRET = '4u2h34uh23423j4h23jk4h2k34ery'

const authMiddleware = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET); 
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).send(error.message);
    }
  };

module.exports = authMiddleware;