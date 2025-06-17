const CartItem = require('../models/CartItem');

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  try {
    await CartItem.add(userId, product_id, quantity || 1);
    res.json({ message: 'Item adicionado ao carrinho!' });
  } catch (err) {
    console.error("Erro ao adicionar item ao carrinho:", err);
    res.status(500).json({ error: 'Erro ao adicionar item.' });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const items = await CartItem.list(userId);
    res.json({ cart: items });
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    res.status(500).json({ error: 'Erro ao buscar carrinho.' });
  }
};

exports.removeItem = async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.id;
  try {
    await CartItem.remove(itemId, userId);
    res.json({ message: 'Item removido do carrinho.' });
  } catch (err) {
    console.error(`Erro ao remover item ${itemId} do carrinho:`, err);
    res.status(500).json({ error: 'Erro ao remover item.' });
  }
};

exports.clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    await CartItem.clear(userId);
    res.json({ message: 'Carrinho limpo.' });
  } catch (err) {
    console.error("Erro ao limpar carrinho:", err);
    res.status(500).json({ error: 'Erro ao limpar carrinho.' });
  }
};
