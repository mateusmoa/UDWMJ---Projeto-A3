const db = require('../config/db');
const { promisify } = require('util');

const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

const Product = {
  async create(name, description, price, restaurantId) {
    await dbRun(
      `INSERT INTO products (name, description, price, restaurant_id)
       VALUES (?, ?, ?, ?)`,
      [name, description, price, restaurantId]
    );

    const { id } = await dbGet(`SELECT last_insert_rowid() AS id`);
    return { id, name, description, price, restaurantId };
  },

  async findAll() {
    return dbAll('SELECT * FROM products');
  },

  async findById(id) {
    return dbGet('SELECT * FROM products WHERE id = ?', [id]);
  },

  async findByRestaurant(restaurantId) {
    return dbAll('SELECT * FROM products WHERE restaurant_id = ?', [restaurantId]);
  },

  async update(id, name, description, price) {
    await dbRun(
      `UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?`,
      [name, description, price, id]
    );
    return { id, name, description, price };
  },

  async delete(id) {
    return dbRun('DELETE FROM products WHERE id = ?', [id]);
  }
};

module.exports = Product;
