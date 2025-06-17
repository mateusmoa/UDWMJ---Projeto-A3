const db = require('../config/db');

exports.getWeeklyMetrics = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await new Promise((resolve, reject) => {
      db.get(
        `SELECT
          SUM(p.kcal * oi.quantity) AS totalCalories,
          SUM(p.proteins * oi.quantity) AS totalProteins,
          COUNT(oi.id) AS totalMeals,
          SUM(o.total) AS totalSpent
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
          AND DATE(o.date) >= DATE('now', '-6 days')`,
        [userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    const metrics = {
      totalCalories: result.totalCalories || 0,
      totalProteins: result.totalProteins || 0,
      totalMeals: result.totalMeals || 0,
      totalSpent: result.totalSpent || 0,
    };

    res.json(metrics);
  } catch (error) {
    console.error("Erro getWeeklyMetrics:", error);
    res.status(500).json({ error: "Erro ao buscar métricas semanais" });
  }
};
