const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET = 'nutrifood_secret';
const cors = require('cors');

router.use(cors());
router.use(express.json());

// Validação do token de usuário
router.get('/validate-user-token', (req, res) => {
  console.log("Headers recebidos:", req.headers);

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("Header 'Authorization' não fornecido");
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error("Token indefinido após o split:", authHeader);
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Token decodificado:", decoded);
    if (decoded.role === 'user') {
      return res.status(200).json({ error: false, message: "Token válido" });
    } else {
      return res.status(403).json({ error: 'Token não autorizado para usuário.' });
    }
  } catch (err) {
    console.error("Erro no jwt.verify:", err);
    return res.status(401).json({ error: 'Token inválido.' });
  }
});

// Validação do token de restaurante
router.get('/validate-restaurant-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.role === 'restaurant') {
      return res.status(200).json({ error: false, message: "Token válido" });
    } else {
      return res.status(403).json({ error: 'Token não autorizado para restaurante.' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
});

module.exports = router;
