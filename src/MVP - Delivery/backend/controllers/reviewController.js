const db = require('../config/db');
const { promisify } = require('util');
const Review = require('../models/Review');

const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

exports.createReview = async (req, res) => {
  const user_id = req.user.id;
  const { order_id, rating, comment } = req.body;

  if (!rating || !order_id) {
    return res.status(400).json({ error: "Campos obrigatórios: rating e order_id" });
  }

  try {
    // Busca o pedido com status 'entregue' para confirmar a permissão de avaliação
    const orderQuery = `
      SELECT o.*, p.restaurant_id 
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      WHERE o.id = ? AND o.user_id = ? AND o.status = 'entregue'
    `;
    const order = await dbGet(orderQuery, [order_id, user_id]);

    if (!order) {
      return res.status(403).json({ error: "Avaliação não permitida para este pedido" });
    }

    // Verifica se já foi avaliado
    const alreadyReviewed = await Review.hasReviewed(order_id);
    if (alreadyReviewed) {
      return res.status(400).json({ error: "Este pedido já foi avaliado" });
    }

    // Cria a avaliação
    await Review.create(user_id, order.restaurant_id, order_id, rating, comment);
    return res.status(201).json({ message: "Avaliação registrada com sucesso!" });
  } catch (error) {
    console.error("Erro createReview:", error);
    return res.status(500).json({ error: "Erro ao registrar avaliação" });
  }
};

exports.getReviewsByRestaurant = async (req, res) => {
  const restaurantId = req.params.restaurantId;

  try {
    const query = `
      SELECT r.*, u.name AS userName 
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.restaurant_id = ?
    `;
    const reviews = await dbAll(query, [restaurantId]);
    return res.json(reviews);
  } catch (error) {
    console.error("Erro getReviewsByRestaurant:", error);
    return res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
};

exports.getReviewsByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT r.*, p.name AS productName, rest.name AS restaurantName 
      FROM reviews r
      JOIN products p ON p.id = r.product_id
      JOIN restaurants rest ON rest.id = r.restaurant_id
      WHERE r.user_id = ?
    `;
    const reviews = await dbAll(query, [userId]);
    return res.json(reviews);
  } catch (error) {
    console.error("Erro getReviewsByUser:", error);
    return res.status(500).json({ error: "Erro ao buscar avaliações do usuário" });
  }
};
