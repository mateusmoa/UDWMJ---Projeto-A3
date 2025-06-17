const db = require('../config/db');

function runGet(query, param) {
  return new Promise((resolve, reject) => {
    db.get(query, [param], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function runAll(query, param) {
  return new Promise((resolve, reject) => {
    db.all(query, [param], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

exports.getRestaurantDashboard = async (req, res) => {
  const restId = req.user.id;

  const queries = {
    totalRevenue: `SELECT SUM(total) AS total FROM orders WHERE restaurant_id = ?`,
    weeklyRevenue: `SELECT SUM(total) AS total FROM orders WHERE restaurant_id = ? AND date >= date('now', '-7 day')`,
    orderStats: `
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) AS cancelados,
        SUM(CASE WHEN status = 'entregue' THEN 1 ELSE 0 END) AS entregues,
        SUM(CASE WHEN status = 'atrasado' THEN 1 ELSE 0 END) AS atrasados
      FROM orders WHERE restaurant_id = ?`,
    reviews: `
      SELECT r.rating, r.comment, r.date, u.name AS user_name
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.restaurant_id = ?
      ORDER BY r.date DESC
      LIMIT 5`
  };

  try {
    const totalRevenue = await runGet(queries.totalRevenue, restId);
    const weeklyRevenue = await runGet(queries.weeklyRevenue, restId);
    const orderStats = await runGet(queries.orderStats, restId);
    const reviews = await runAll(queries.reviews, restId);

    res.json({
      totalRevenue: totalRevenue?.total || 0,
      weeklyRevenue: weeklyRevenue?.total || 0,
      orderStats,
      reviews
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no dashboard", details: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const query = `
      SELECT o.*, u.name AS client
      FROM orders o
      JOIN users u ON u.id = o.user_id
      WHERE o.restaurant_id = ?
      ORDER BY o.date DESC
    `;
    const orders = await runAll(query, req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await new Promise((resolve, reject) => {
      db.run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status', details: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const query = `
      SELECT r.*, u.name AS user_name
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.restaurant_id = ?
      ORDER BY r.date DESC
    `;
    const reviews = await runAll(query, req.user.id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar avaliações', details: error.message });
  }
};
