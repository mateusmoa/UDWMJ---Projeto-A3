const jwt = require('jsonwebtoken');
const SECRET = 'nutrifood_secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: "Token não fornecido" });

  const token = authHeader.replace("Bearer ", "");
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = decoded;
    next();
  });
};
