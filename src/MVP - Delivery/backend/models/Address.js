const db = require('../config/db');

const Address = {
  // Criar novo endereço (garante que só um seja principal por usuário)
  create: (
    user_id, category, street, city, state, zip, number,
    complement, neighborhood, nickname, is_main
  ) => {
    return new Promise((resolve, reject) => {
      const exec = async () => {
        if (is_main) {
          db.run('UPDATE addresses SET is_main = 0 WHERE user_id = ?', [user_id]);
        }

        const query = `
          INSERT INTO addresses (
            user_id, category, street, city, state, zip, number,
            complement, neighborhood, nickname, is_main
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(
          query,
          [
            user_id, category, street, city, state, zip, number,
            complement, neighborhood, nickname, is_main ? 1 : 0
          ],
          function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
          }
        );
      };

      exec();
    });
  },

  // Atualizar endereço existente (também garante exclusividade do principal)
  update: (
    id, category, street, city, state, zip, number,
    complement, neighborhood, nickname, is_main
  ) => {
    return new Promise((resolve, reject) => {
      const exec = async () => {
        if (is_main) {
          db.run(
            `UPDATE addresses SET is_main = 0 WHERE user_id = (
              SELECT user_id FROM addresses WHERE id = ?
            )`,
            [id]
          );
        }

        const query = `
          UPDATE addresses
          SET category = ?, street = ?, city = ?, state = ?, zip = ?, number = ?,
              complement = ?, neighborhood = ?, nickname = ?, is_main = ?
          WHERE id = ?
        `;
        db.run(
          query,
          [
            category, street, city, state, zip, number,
            complement, neighborhood, nickname, is_main ? 1 : 0,
            id
          ],
          function (err) {
            if (err) return reject(err);
            resolve();
          }
        );
      };

      exec();
    });
  },

  // Buscar todos os endereços de um usuário
  findByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM addresses WHERE user_id = ?',
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  // (Opcional) Deletar um endereço por ID
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM addresses WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

module.exports = Address;
