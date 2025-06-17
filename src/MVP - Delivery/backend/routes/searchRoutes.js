const express = require('express');
const router = express.Router();
const db = require('../config/db');
const haversine = require('haversine-distance');

// Função utilitária para executar consultas e retornar uma Promise
const runAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Rota de busca com filtros e geolocalização
router.get('/', async (req, res) => {
  try {
    const {
      query = '',
      categoria = '',
      preferencias = '',
      priceMin = 0,
      priceMax = 999999,
      kcalMin = 0,
      kcalMax = 999999,
      lat,
      lng,
    } = req.query;

    // Construção da query SQL com filtros básicos
    let sql = `
      SELECT p.*, r.name AS restaurante, r.latitude, r.longitude
      FROM products p
      JOIN restaurants r ON p.restaurant_id = r.id
      WHERE p.name LIKE ?
        AND (? = '' OR p.category = ?)
        AND p.price BETWEEN ? AND ?
        AND p.kcal BETWEEN ? AND ?
    `;
    let params = [
      `%${query}%`,
      categoria, categoria,
      priceMin, priceMax,
      kcalMin, kcalMax,
    ];

    // Se preferências foram enviadas, adiciona filtro para categoria utilizando IN()
    if (preferencias) {
      const prefsArray = preferencias.split(',').map(s => s.trim());
      sql += ` AND p.category IN (${prefsArray.map(() => '?').join(',')})`;
      params = params.concat(prefsArray);
    }

    // Executa a consulta no banco de dados
    let rows = await runAll(sql, params);

    // Se latitude e longitude forem informados, calcula a distância entre a localização do usuário e cada restaurante
    if (lat && lng) {
      const userLoc = { latitude: parseFloat(lat), longitude: parseFloat(lng) };
      rows = rows.map(item => {
        const restLoc = { latitude: item.latitude, longitude: item.longitude };
        const distance = haversine(userLoc, restLoc); // distância em metros
        return { ...item, distance };
      });

      // Ordena os resultados da menor para a maior distância
      rows.sort((a, b) => a.distance - b.distance);
    }

    res.json(rows);
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({ error: 'Erro ao realizar busca' });
  }
});

module.exports = router;
