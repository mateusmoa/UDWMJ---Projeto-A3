const db = require('../config/db');
const { promisify } = require('util');

// Promisificação dos métodos do SQLite
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

/**
 * Cria um novo pedido.
 * - Insere o pedido na tabela `orders`
 * - Insere os itens na tabela `order_items`
 * - Remove os itens do carrinho do usuário
 */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, payment_method } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // Calcula o total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Insere o pedido e, em seguida, obtém o último ID inserido
    await dbRun(
      `INSERT INTO orders (user_id, total, payment_method) VALUES (?, ?, ?)`,
      [userId, total, payment_method]
    );
    const orderRow = await dbGet(`SELECT last_insert_rowid() AS orderId`);
    const orderId = orderRow.orderId;

    // Prepara a inserção dos itens do pedido
    const stmt = db.prepare(
      `INSERT INTO order_items (order_id, product_id, quantity, observation) VALUES (?, ?, ?, ?)`
    );

    // Insere cada item; usamos uma Promise para esperar cada inserção
    for (const item of items) {
      await new Promise((resolve, reject) => {
        stmt.run(
          orderId,
          item.product_id,
          item.quantity,
          item.observation || null,
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    stmt.finalize();

    // Remove os itens do carrinho
    await dbRun(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);

    res.status(201).json({ message: 'Pedido criado', order_id: orderId });
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ error: 'Erro ao processar pedido' });
  }
};

/**
 * Retorna o status atual de um pedido.
 * O endpoint esperado é: GET /api/orders/:id/status
 */
exports.getOrderStatus = async (req, res) => {
  try {
    // Nota: Verifique se sua rota está definida com o parâmetro :id ou :orderId
    const orderId = req.params.id;
    const userId = req.user.id;

    const row = await dbGet(
      `SELECT status FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (!row) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({ status: row.status });
  } catch (err) {
    console.error('Erro ao buscar status do pedido:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * Retorna todos os pedidos do usuário, com detalhes dos itens.
 */
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT o.id, o.total, o.status, o.date,
             GROUP_CONCAT(p.name || ' x' || oi.quantity, ', ') AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.date DESC
    `;
    const rows = await dbAll(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
};
