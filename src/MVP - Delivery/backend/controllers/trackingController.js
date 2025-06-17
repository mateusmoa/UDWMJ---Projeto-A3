const db = require('../config/db');
const { promisify } = require('util');
const dbGet = promisify(db.get.bind(db));

exports.getCurrentOrderStatus = async (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT o.id, o.status, o.date, o.total, o.payment_method,
           GROUP_CONCAT(p.name || ' x' || oi.quantity, ', ') AS produtos
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = ?
    ORDER BY o.date DESC
    LIMIT 1`;

  try {
    const row = await dbGet(query, [userId]);
    if (!row) {
      return res.status(404).json({ message: "Nenhum pedido encontrado" });
    }
    res.json(row);
  } catch (error) {
    console.error("Erro ao buscar status do pedido:", error);
    res.status(500).json({ error: error.message });
  }
};
