-- Apaga as tabelas se existirem para recriar do zero
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS users;

-- Tabela de usuários do sistema
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,     -- ID único do usuário
  name TEXT NOT NULL,                        -- Nome completo do usuário
  email TEXT UNIQUE NOT NULL,                -- Email único para login
  password TEXT NOT NULL,                    -- Senha (hash)
  phone TEXT,                                -- Telefone
  preferencias TEXT                         -- Preferências adicionais (JSON)
);

-- Tabela para armazenar preferências do usuário (1 registro por usuário)
CREATE TABLE preferences (
  user_id INTEGER PRIMARY KEY,              -- ID do usuário, chave primária e estrangeira
  notifications INTEGER NOT NULL DEFAULT 0, -- Se recebe notificações (0=não, 1=sim)
  darkMode INTEGER NOT NULL DEFAULT 0,      -- Modo escuro ativado (0=não, 1=sim)
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  -- Ao deletar usuário, deleta preferências automaticamente
);

-- Tabela dos restaurantes cadastrados
CREATE TABLE restaurants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,      -- ID único do restaurante
  name TEXT NOT NULL,                        -- Nome do restaurante
  businessName TEXT NOT NULL,                -- Nome fantasia do restaurante
  cnpj TEXT NOT NULL,                        -- CNPJ do restaurante
  email TEXT NOT NULL,                       -- Email de contato do restaurante
  password TEXT NOT NULL,                    -- Senha (hash) para acesso administrativo
  address TEXT NOT NULL,                     -- Endereço físico do restaurante
  phone TEXT NOT NULL,                       -- Telefone de contato do restaurante
  description TEXT,                          -- Descrição do restaurante
  banner TEXT                                -- URL ou caminho do banner do restaurante
);



-- Tabela de endereços dos usuários
CREATE TABLE addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,                  -- ID do usuário dono do endereço
  zip TEXT NOT NULL,                         -- CEP
  street TEXT NOT NULL,                      -- Rua
  number TEXT NOT NULL,                      -- Número
  complement TEXT,                          -- Complemento (opcional)
  neighborhood TEXT,                        -- Bairro (opcional)
  city TEXT NOT NULL,                        -- Cidade
  state TEXT NOT NULL,                       -- Estado
  category TEXT NOT NULL,                    -- Categoria do endereço (ex: casa, trabalho)
  nickname TEXT,                            -- Apelido dado pelo usuário (ex: "Lar doce lar")
  is_main INTEGER DEFAULT 0,                 -- Indica se é o endereço principal (0 = não, 1 = sim)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Data e hora de criação
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ao deletar usuário, deleta endereços automaticamente
);

-- Tabela de categorias de produtos
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE                  -- Nome único da categoria (ex: Bebidas, Lanches)
);

-- Tabela dos produtos oferecidos pelos restaurantes
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  restaurant_id INTEGER NOT NULL,            -- ID do restaurante dono do produto
  name TEXT NOT NULL,                        -- Nome do produto
  description TEXT,                         -- Descrição do produto
  kcal INTEGER,                            -- Valor calórico (calorias)
  proteins REAL,                            -- Proteínas (g)
  price REAL NOT NULL,                       -- Preço do produto
  img TEXT,                               -- URL ou caminho da imagem do produto
  category_id INTEGER,                      -- Categoria do produto
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabela de pedidos realizados pelos usuários
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,                  -- ID do usuário que fez o pedido
  restaurant_id INTEGER,                     -- ID do restaurante do pedido (pode ser NULL)
  payment_method TEXT,                      -- Método de pagamento escolhido
  total REAL,                              -- Valor total do pedido
  date TEXT DEFAULT CURRENT_TIMESTAMP,      -- Data/hora do pedido
  status TEXT DEFAULT 'pendente',            -- Status do pedido (ex: pendente, entregue)
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- Tabela de itens específicos dentro de um pedido
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,                 -- Pedido ao qual pertence
  product_id INTEGER NOT NULL,               -- Produto pedido
  quantity INTEGER DEFAULT 1,                -- Quantidade pedida
  observation TEXT,                         -- Observações/observações do cliente
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Tabela de avaliações feitas pelos usuários para restaurantes e pedidos
CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,                  -- Usuário que avaliou
  restaurant_id INTEGER NOT NULL,            -- Restaurante avaliado
  order_id INTEGER NOT NULL UNIQUE,          -- Pedido avaliado (1 avaliação por pedido)
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Nota de 1 a 5
  comment TEXT,                            -- Comentário/opinião
  date TEXT DEFAULT CURRENT_TIMESTAMP,      -- Data da avaliação
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Tabela do carrinho de compras dos usuários
CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,                  -- Usuário dono do carrinho
  product_id INTEGER NOT NULL,               -- Produto adicionado
  quantity INTEGER NOT NULL DEFAULT 1,       -- Quantidade desejada
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabela de promoções para produtos
CREATE TABLE promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,                -- Produto em promoção
  promo_price REAL NOT NULL,                   -- Preço promocional
  start_date TEXT,                           -- Data de início da promoção
  end_date TEXT,                             -- Data de fim da promoção
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- Criação de índices para melhorar performance em consultas
CREATE INDEX idx_user_email ON users(email); 
CREATE INDEX idx_user_preferences ON preferences(user_id);
CREATE INDEX idx_restaurant_name ON restaurants(name);
CREATE INDEX idx_restaurant_cnpj ON restaurants(cnpj);
CREATE INDEX idx_restaurant_email ON restaurants(email);
CREATE INDEX idx_restaurant_phone ON restaurants(phone);
CREATE INDEX idx_product_name ON products(name);
CREATE INDEX idx_product_restaurant ON products(restaurant_id);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_restaurant ON orders(restaurant_id);
CREATE INDEX idx_order_date ON orders(date);
CREATE INDEX idx_order_item_order ON order_items(order_id);
CREATE INDEX idx_order_item_product ON order_items(product_id);
CREATE INDEX idx_review_user ON reviews(user_id);
CREATE INDEX idx_review_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_review_order ON reviews(order_id);

-- Índices para otimizar consultas de endereços
CREATE INDEX idx_user_id ON addresses(user_id);
CREATE INDEX idx_main_address ON addresses(user_id, is_main);
