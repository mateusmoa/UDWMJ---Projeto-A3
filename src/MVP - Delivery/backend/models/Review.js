const db = require('../config/db');
const { promisify } = require('util');

// Criamos uma função customizada para o db.run para capturar o lastID.
const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });

// Para db.get, podemos usar promisify diretamente.
const dbGet = promisify(db.get.bind(db));

const Review = {
  create: (user_id, restaurant_id, order_id, rating, comment) => {
    return dbRun(
      `INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, restaurant_id, order_id, rating, comment]
    );
  },

  hasReviewed: (order_id) => {
    return dbGet("SELECT * FROM reviews WHERE order_id = ?", [order_id])
      .then((row) => !!row);
  }
};

module.exports = Review;
