const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();

async function run() {
  try {
    const dbDir = path.join(__dirname, "database");
    if (!fs.existsSync(dbDir)) {
      console.log("📁 Criando pasta do banco:", dbDir);
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.join(dbDir, "db.sqlite");
    console.log("🗂️ Banco de dados em:", dbPath);

    const db = new sqlite3.Database(dbPath);

    const execAsync = (sql) =>
      new Promise((resolve, reject) => {
        db.exec(sql, (err) => (err ? reject(err) : resolve()));
      });

    const runAsync = (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve(this);
        });
      });

    const schemaPath = path.join(dbDir, "seed.sql");
    if (!fs.existsSync(schemaPath)) {
      throw new Error("Arquivo seed.sql não encontrado em: " + schemaPath);
    }

    console.log("📄 Carregando estrutura do seed.sql...");
    const schema = fs.readFileSync(schemaPath, "utf8");
    await execAsync(schema);
    console.log("✅ Banco de dados criado com sucesso!");

    // Inserir usuário exemplo
    const hashedPass = await bcrypt.hash("user1234", 10);
    await runAsync(
      `INSERT INTO users (name, email, password, phone, preferencias)
       VALUES (?, ?, ?, ?, ?)`,
      [
        "João da Neves",
        "test.user@nutrifood.com",
        hashedPass,
        "(11) 91234-5678",
        JSON.stringify(["Vegetariano", "Sem glúten"]),
      ]
    );

    await runAsync(
      `INSERT INTO addresses (user_id, zip, street, number, complement, neighborhood, city, state, category, nickname, is_main)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [1, "01001-000", "Rua das Flores", "123", null, null, "São Paulo", "SP", "Casa", "Lar doce lar", 1]
    );

    // Restaurantes
    const restaurants = [
      {
        name: "SaladaFit",
        businessName: "SaladaFit Ltda.",
        cnpj: "12.345.678/0001-90",
        email: "saladafit@nutrifood.com",
        password: "salada123",
        address: "Av. Paulista, 1000 - São Paulo, SP",
        phone: "(11) 93456-7890",
        description: "Especializado em saladas frescas e bowls fitness.",
        banner: "https://placehold.co/600x300?text=SaladaFit",
      },
      {
        name: "PowerGrill",
        businessName: "PowerGrill Proteicos S.A.",
        cnpj: "23.456.789/0001-10",
        email: "powergrill@nutrifood.com",
        password: "grill123",
        address: "Rua Augusta, 500 - São Paulo, SP",
        phone: "(11) 94567-1234",
        description: "Carnes grelhadas com baixo teor de gordura e alto valor nutricional.",
        banner: "https://placehold.co/600x300?text=PowerGrill",
      },
      {
        name: "VeganDelight",
        businessName: "VeganDelight Natural Foods ME",
        cnpj: "34.567.890/0001-01",
        email: "vegandelight@nutrifood.com",
        password: "vegan123",
        address: "Rua Harmonia, 250 - São Paulo, SP",
        phone: "(11) 95678-4321",
        description: "Pratos veganos criativos, saborosos e nutritivos para todos os públicos.",
        banner: "https://placehold.co/600x300?text=VeganDelight",
      },
    ];

    for (const r of restaurants) {
      const hash = await bcrypt.hash(r.password, 10);
      await runAsync(
        `INSERT INTO restaurants (name, businessName, cnpj, email, password, address, phone, description, banner)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.name, r.businessName, r.cnpj, r.email, hash, r.address, r.phone, r.description, r.banner]
      );
    }

    const categories = ["Saudável", "Proteico", "Vegano"];
    for (const c of categories) {
      await runAsync(`INSERT INTO categories (name) VALUES (?)`, [c]);
    }

    const products = [
      [1, "Salada Caesar", "Salada com alface, frango grelhado, parmesão e molho Caesar.", 320, 30, 22.9, "https://placehold.co/400x300?text=Caesar", 1],
      [1, "Bowl Mediterrâneo", "Quinoa, grão-de-bico, pepino, tomate, azeite e limão.", 400, 18, 26.5, "https://placehold.co/400x300?text=Mediterraneo", 1],
      [2, "Frango Grelhado", "Peito de frango grelhado com arroz integral e legumes.", 350, 40, 29.9, "https://placehold.co/400x300?text=Frango+Grelhado", 2],
      [2, "Marmita Fit", "Carne magra com batata doce e brócolis.", 380, 36, 27.0, "https://placehold.co/400x300?text=Marmita+Fit", 2],
      [3, "Tofu Oriental", "Cubos de tofu salteados com vegetais e molho shoyu.", 300, 20, 25.5, "https://placehold.co/400x300?text=Tofu", 3],
      [3, "Hambúrguer Vegano", "Hambúrguer de grão-de-bico com maionese vegana.", 450, 22, 24.0, "https://placehold.co/400x300?text=VegBurger", 3],
    ];

    for (const p of products) {
      await runAsync(
        `INSERT INTO products (restaurant_id, name, description, kcal, proteins, price, img, category_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        p
      );
    }

    const promotions = [
      [1, 19.9, "2025-06-10", "2025-06-30"],
      [3, 25.9, "2025-06-10", "2025-06-30"],
      [5, 21.9, "2025-06-10", "2025-06-30"],
    ];

    for (const promo of promotions) {
      await runAsync(
        `INSERT INTO promotions (product_id, promo_price, start_date, end_date)
         VALUES (?, ?, ?, ?)`,
        promo
      );
    }

    console.log("✅ Dados inseridos com sucesso!");
    db.close(() => console.log("🔒 Conexão com o banco encerrada."));
  } catch (error) {
    console.error("❌ Erro durante o seed:", error.message);
    process.exit(1);
  }

  console.log("🚀 Seed finalizado com sucesso!");
  process.exit(0);
}

run();
