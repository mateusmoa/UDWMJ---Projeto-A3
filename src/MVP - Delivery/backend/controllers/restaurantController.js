const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'nutrifood_secret';


function isValidRestaurant(data) {
  const requiredFields = ['name', 'businessName', 'cnpj', 'email', 'password', 'address', 'phone'];
  return requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
}

exports.loginRestaurant = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const restaurant = await db.get('SELECT * FROM restaurants WHERE email = ?', [email]);
    if (!restaurant) {
      return res.status(401).json({ error: 'Restaurante não encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

   
    const token = jwt.sign({ id: restaurant.id, role: 'restaurant' }, SECRET, { expiresIn: '2h' });
    res.status(200).json({ token, restaurant });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await db.all('SELECT * FROM restaurants');
    res.json(restaurants);
  } catch (error) {
    console.error('Erro ao buscar restaurantes:', error);
    res.status(500).json({ error: 'Erro ao buscar restaurantes.' });
  }
};

exports.getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await db.get('SELECT * FROM restaurants WHERE id = ?', [id]);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurante não encontrado.' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error('Erro ao buscar restaurante:', error);
    res.status(500).json({ error: 'Erro ao buscar restaurante.' });
  }
};

exports.createRestaurant = async (req, res) => {
  const {
    name,
    businessName,
    cnpj,
    email,
    password,
    address,
    phone,
    description = '',
    banner = ''
  } = req.body;

  if (!isValidRestaurant(req.body)) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      `INSERT INTO restaurants (name, businessName, cnpj, email, password, address, phone, description, banner)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, businessName, cnpj, email, hashedPassword, address, phone, description, banner]
    );

    res.status(201).json({ message: 'Restaurante criado com sucesso!', id: result.lastID });
  } catch (error) {
    console.error('Erro ao criar restaurante:', error);
    res.status(500).json({ error: 'Erro ao criar restaurante.' });
  }
};

exports.searchRestaurants = async (req, res) => {
  const query = req.query.query?.toLowerCase().trim();
  if (!query) {
    return res.status(400).json({ error: 'Parâmetro de busca ausente ou vazio.' });
  }

  try {
    const results = await db.all(
      `SELECT * FROM restaurants
       WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ?`,
      [`%${query}%`, `%${query}%`]
    );
    res.json(results);
  } catch (error) {
    console.error('[RESTAURANT SEARCH] Erro ao buscar restaurantes:', error);
    res.status(500).json({ error: 'Erro ao buscar restaurantes.' });
  }
};
