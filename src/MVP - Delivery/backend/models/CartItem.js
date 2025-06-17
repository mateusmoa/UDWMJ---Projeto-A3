const db = require('../config/db');
const { promisify } = require('util');

const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

const CartItem = {
  add: (userId, productId, quantity = 1) => {
    return dbRun(
      `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`,
      [userId, productId, quantity]
    );
  },

  list: (userId) => {
    return dbAll(
      `SELECT ci.id, p.name, p.price, p.img, ci.quantity 
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
      [userId]
    );
  },

  remove: (itemId, userId) => {
    return dbRun(
      `DELETE FROM cart_items WHERE id = ? AND user_id = ?`,
      [itemId, userId]
    );
  },

  clear: (userId) => {
    return dbRun(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);
  }
};

module.exports = CartItem;
