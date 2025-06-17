const db = require('../config/db');
const { promisify } = require('util');

const run = promisify(db.run.bind(db));
const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));

const logPrefix = '[PRODUCT]';

exports.createProduct = async (req, res) => {
  const { name, description, price, restaurantId } = req.body;

  if (!name || !description || !price || !restaurantId) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const result = await run(
      `INSERT INTO products (name, description, price, restaurant_id)
       VALUES (?, ?, ?, ?)`,
      [name, description, price, restaurantId]
    );
    const newProduct = await get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    console.error(`${logPrefix}[CREATE]`, err);
    res.status(500).json({ success: false, message: 'Erro ao criar produto.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await all('SELECT * FROM products');
    res.json({ success: true, data: products });
  } catch (err) {
    console.error(`${logPrefix}[GET ALL]`, err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
};

exports.getProductsOnSale = async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const products = await all(
      `SELECT 
         p.*, 
         promo.promo_price,
         promo.start_date,
         promo.end_date
       FROM products p
       INNER JOIN promotions promo 
         ON p.id = promo.product_id
       WHERE date(?) BETWEEN IFNULL(date(promo.start_date), date(?))
                         AND IFNULL(date(promo.end_date), date(?))`,
      [today, today, today]
    );

    res.json({ success: true, data: products });
  } catch (err) {
    console.error(`${logPrefix}[ON SALE]`, err);
    res.status(500).json({ success: false, message: 'Erro ao buscar promoções.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    console.error(`${logPrefix}[GET BY ID]`, err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produto.' });
  }
};

exports.getProductsByRestaurant = async (req, res) => {
  try {
    const products = await all(
      'SELECT * FROM products WHERE restaurant_id = ?',
      [req.params.restaurantId]
    );
    res.json({ success: true, data: products });
  } catch (err) {
    console.error(`${logPrefix}[BY RESTAURANT]`, err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
};

exports.searchProducts = async (req, res) => {
  const query = req.query.query?.toString().toLowerCase().trim();

  if (!query) {
    return res.status(400).json({ success: false, message: 'Parâmetro de busca ausente ou vazio.' });
  }

  try {
    const results = await all(
      `SELECT * FROM products
       WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ?`,
      [`%${query}%`, `%${query}%`]
    );
    res.json({ success: true, data: results });
  } catch (err) {
    console.error(`${logPrefix}[SEARCH]`, err);
    res.status(500).json({ success: false, message: 'Erro ao buscar produtos.' });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || typeof price !== 'number') {
    return res.status(400).json({ success: false, message: 'Campos inválidos ou ausentes.' });
  }

  try {
    await run(
      `UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?`,
      [name, description, price, req.params.id]
    );

    const updated = await get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(`${logPrefix}[UPDATE]`, err);
    res.status(500).json({ success: false, message: 'Erro ao atualizar produto.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await run('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Produto deletado com sucesso.' });
  } catch (err) {
    console.error(`${logPrefix}[DELETE]`, err);
    res.status(500).json({ success: false, message: 'Erro ao deletar produto.' });
  }
};
