const Promotion = require('../models/Promotion');

exports.create = async (req, res) => {
  const { product_id, promo_price, start_date, end_date } = req.body;

  if (!product_id || !promo_price) {
    return res.status(400).json({ error: "Produto e preço promocional são obrigatórios." });
  }

  try {
    await Promotion.create({ product_id, promo_price, start_date, end_date });
    res.status(201).json({ message: "Promoção cadastrada." });
  } catch {
    res.status(500).json({ error: "Erro ao criar promoção." });
  }
};

exports.getActive = async (req, res) => {
  try {
    const rows = await Promotion.listActive();
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Erro ao buscar promoções." });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Promotion.delete(id);
    res.json({ message: "Promoção removida." });
  } catch {
    res.status(500).json({ error: "Erro ao remover promoção." });
  }
};
