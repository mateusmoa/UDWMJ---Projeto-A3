const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const SECRET = 'nutrifood_secret';


exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }
    if (!user.password) {
      return res.status(500).json({ error: "Senha ausente no banco de dados" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign({ id: user.id, role: "user" }, SECRET, { expiresIn: "2h" });
    res.json({ token, user });
  });
};

exports.register = (req, res) => {
  const { name, email, password, phone, preferencias } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (user) return res.status(400).json({ error: "Email já registrado." });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const preferenciasStr = JSON.stringify(preferencias || []);

    db.run(
      "INSERT INTO users (name, email, password, phone, preferencias) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, phone, preferenciasStr],
      function (err) {
        if (err) return res.status(500).json({ error: "Erro ao registrar usuário" });

        const newUser = { id: this.lastID, name, email, phone, preferencias };
        const token = jwt.sign({ id: newUser.id, role: "user" }, SECRET, { expiresIn: "2h" });
        res.status(201).json({ token, user: newUser });
      }
    );
  });
};

exports.getCurrentUser = (req, res) => {
  const userId = req.user.id;
  const query = `SELECT id, name, email, phone, preferencias FROM users WHERE id = ?`;
  
  db.get(query, [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      preferencias: user.preferencias ? JSON.parse(user.preferencias) : [],
    });
  });
};


exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password, preferencias } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios." });
  }

  try {
    let passwordHash = null;
    if (password && password.trim() !== "") {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const preferenciasStr = JSON.stringify(preferencias || []);

    if (passwordHash) {
      db.run(
        "UPDATE users SET name = ?, email = ?, password = ?, preferencias = ? WHERE id = ?",
        [name, email, passwordHash, preferenciasStr, userId],
        function (err) {
          if (err) return res.status(500).json({ error: "Erro ao atualizar perfil" });
          res.json({ message: "Perfil atualizado com sucesso" });
        }
      );
    } else {
      db.run(
        "UPDATE users SET name = ?, email = ?, preferencias = ? WHERE id = ?",
        [name, email, preferenciasStr, userId],
        function (err) {
          if (err) return res.status(500).json({ error: "Erro ao atualizar perfil" });
          res.json({ message: "Perfil atualizado com sucesso" });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ error: "Erro interno ao atualizar perfil" });
  }
};


exports.deleteAccount = (req, res) => {
  const userId = req.user.id;
  db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao excluir conta" });
    res.json({ message: "Conta excluída com sucesso" });
  });
};

exports.getAddresses = (req, res) => {
  const userId = req.user.id;
  db.all("SELECT * FROM addresses WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar endereços" });
    res.json(rows);
  });
};

exports.addAddress = (req, res) => {
  const userId = req.user.id;
  const { label, street, city, zip } = req.body;
  if (!label || !street || !city || !zip) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }
  db.run(
    "INSERT INTO addresses (user_id, label, street, city, zip) VALUES (?, ?, ?, ?, ?)",
    [userId, label, street, city, zip],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao adicionar endereço" });
      res.status(201).json({ id: this.lastID, label, street, city, zip });
    }
  );
};

exports.updateAddress = (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;
  const { label, street, city, zip } = req.body;
  db.run(
    "UPDATE addresses SET label = ?, street = ?, city = ?, zip = ? WHERE id = ? AND user_id = ?",
    [label, street, city, zip, addressId, userId],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao atualizar endereço" });
      res.json({ message: "Endereço atualizado com sucesso" });
    }
  );
};

exports.getMetrics = (req, res) => {
  const userId = req.user.id;
  db.get(
    "SELECT calorias, refeicoes, proteinas FROM metrics WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar métricas" });
      res.json(row || { calorias: '', refeicoes: '', proteinas: '' });
    }
  );
};

exports.getGoals = (req, res) => {
  const userId = req.user.id;
  db.get(
    "SELECT calorias, refeicoes, proteinas FROM goals WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar metas" });
      res.json(row || { calorias: '', refeicoes: '', proteinas: '' });
    }
  );
};


exports.updateGoals = (req, res) => {
  const userId = req.user.id;
  const { calorias, refeicoes, proteinas } = req.body;
  db.run(
    "INSERT INTO goals (user_id, calorias, refeicoes, proteinas) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET calorias = excluded.calorias, refeicoes = excluded.refeicoes, proteinas = excluded.proteinas",
    [userId, calorias, refeicoes, proteinas],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao atualizar metas" });
      res.json({ message: "Metas atualizadas com sucesso" });
    }
  );
};


exports.getPreferences = (req, res) => {
  const userId = req.user.id;
  db.get(
    "SELECT notifications, darkMode FROM preferences WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar preferências" });
      if (!row) return res.json({ notifications: false, darkMode: false });
      res.json({ notifications: !!row.notifications, darkMode: !!row.darkMode });
    }
  );
};


exports.updatePreferences = (req, res) => {
  const userId = req.user.id;
  const { notifications, darkMode } = req.body;
  db.run(
    `INSERT INTO preferences (user_id, notifications, darkMode)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET notifications = excluded.notifications, darkMode = excluded.darkMode`,
    [userId, notifications ? 1 : 0, darkMode ? 1 : 0],
    (err) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar preferências" });
      res.json({ message: "Preferências atualizadas com sucesso" });
    }
  );
};


exports.updatePassword = (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "As senhas antiga e nova são obrigatórias." });
  }

  db.get("SELECT password FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar usuário" });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Senha antiga incorreta" });

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.run("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId], (err) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar senha" });
      res.json({ message: "Senha atualizada com sucesso" });
    });
  });
};

exports.getUserOrders = (req, res) => {
  const userId = req.user.id;
  db.all(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, orders) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar pedidos" });
      res.json(orders);
    }
  );
};
