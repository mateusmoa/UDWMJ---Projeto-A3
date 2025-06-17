const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

const dbPath = path.resolve(__dirname, '../database/db.sqlite');
const rawDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar com o banco:", err.message);
  } else {
    console.log("✅ Banco de dados conectado com sucesso!");
  }
});

const db = {
  all: promisify(rawDb.all.bind(rawDb)),
  get: promisify(rawDb.get.bind(rawDb)),
  run: promisify(rawDb.run.bind(rawDb)),
  close: promisify(rawDb.close.bind(rawDb))
};

module.exports = db;
