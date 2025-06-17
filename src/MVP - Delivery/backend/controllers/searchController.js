const db = require('../config/db');
const { promisify } = require('util');
const dbAll = promisify(db.all.bind(db));

exports.buscarAlimentos = async (req, res) => {
  try {
    const { query = "", categoria, preferencias } = req.query;

    let sql = `
      SELECT p.*, r.name AS restaurante, c.name AS categoria
      FROM products p
      JOIN restaurants r ON r.id = p.restaurant_id
      JOIN categories c ON c.id = p.category_id
      WHERE (p.name LIKE ? OR r.name LIKE ?)`;
    const params = [`%${query}%`, `%${query}%`];

    // Filtra por categoria, se fornecida
    if (categoria) {
      sql += ` AND c.name = ?`;
      params.push(categoria);
    }

    // Filtra por preferências alimentares (ex: ["vegano", "sem glúten"])
    if (preferencias) {
      const prefs = preferencias.split(',');
      prefs.forEach(p => {
        sql += ` AND p.description LIKE ?`;
        params.push(`%${p.trim()}%`);
      });
    }

    const rows = await dbAll(sql, params);
    return res.json(rows);
  } catch (error) {
    console.error("Erro na busca de alimentos:", error);
    return res.status(500).json({ error: error.message });
  }
};
