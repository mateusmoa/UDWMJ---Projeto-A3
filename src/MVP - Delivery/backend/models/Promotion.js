const db = require('../config/db');
const { promisify } = require('util');
const isValidDate = require('../utils/isValidDate');

const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));
const dbGet = promisify(db.get.bind(db));

const Promotion = {
  async create({ product_id, promo_price, start_date, end_date }) {
    // Validar datas no formato ISO
    if (start_date && !isValidDate(start_date)) {
      throw new Error('Data de início inválida (esperado YYYY-MM-DD)');
    }
    if (end_date && !isValidDate(end_date)) {
      throw new Error('Data de término inválida (esperado YYYY-MM-DD)');
    }

    return dbRun(
      `INSERT INTO promotions (product_id, promo_price, start_date, end_date)
       VALUES (?, ?, ?, ?)`,
      [product_id, promo_price, start_date || null, end_date || null]
    );
  },

  async listActive() {
    return dbAll(`
      SELECT p.id AS promo_id, p.product_id, p.promo_price, p.start_date, p.end_date,
             pr.name, pr.price, pr.img, pr.kcal
      FROM promotions p
      JOIN products pr ON p.product_id = pr.id
      WHERE date('now') BETWEEN IFNULL(p.start_date, date('now')) AND IFNULL(p.end_date, date('now'))
    `);
  },

  async findById(id) {
    return dbGet(
      `SELECT * FROM promotions WHERE id = ?`,
      [id]
    );
  },

  async update(id, { promo_price, start_date, end_date }) {
    if (start_date && !isValidDate(start_date)) {
      throw new Error('Data de início inválida');
    }
    if (end_date && !isValidDate(end_date)) {
      throw new Error('Data de término inválida');
    }

    return dbRun(
      `UPDATE promotions
       SET promo_price = ?, start_date = ?, end_date = ?
       WHERE id = ?`,
      [promo_price, start_date || null, end_date || null, id]
    );
  },

  async delete(id) {
    return dbRun(`DELETE FROM promotions WHERE id = ?`, [id]);
  }
};

module.exports = Promotion;
