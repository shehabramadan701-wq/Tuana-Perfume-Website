-- =============================================
--  TUANA Perfume - MySQL database
--  Run this file once (phpMyAdmin > Import, or:  mysql -u root -p < database/schema.sql)
-- =============================================

CREATE DATABASE IF NOT EXISTS tuana_perfume
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tuana_perfume;
SET NAMES utf8mb4;

-- ---------- Users who can open the dashboard ----------
-- role: admin = everything | staff = products + categories only
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,              -- saved encrypted (bcrypt), never as plain text
  role       VARCHAR(20)  NOT NULL DEFAULT 'staff',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Categories (الأقسام) ----------
CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(40)  NOT NULL UNIQUE,       -- short english code, e.g. oud
  name_ar    VARCHAR(100) NOT NULL,
  name_en    VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Products (العطور) ----------
CREATE TABLE IF NOT EXISTS products (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name_ar        VARCHAR(150) NOT NULL,
  name_en        VARCHAR(150) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  category       VARCHAR(40)  NOT NULL,          -- the category slug (see categories table)
  price          DECIMAL(10,2) NOT NULL,
  size           VARCHAR(30),                    -- e.g. 50 ml
  color          VARCHAR(20) DEFAULT '#8B5A2B',  -- bottle color (used when no image)
  image_url      VARCHAR(255),                   -- optional: /images/xxx.png
  is_active      TINYINT(1) DEFAULT 1,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Orders (الطلبات / الحسابات) ----------
CREATE TABLE IF NOT EXISTS orders (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  customer_name  VARCHAR(150) NOT NULL,
  email          VARCHAR(150) NOT NULL,
  phone          VARCHAR(30)  NOT NULL,
  city           VARCHAR(80),
  address        VARCHAR(255),
  total          DECIMAL(10,2) NOT NULL,
  currency       VARCHAR(5) DEFAULT 'EGP',
  status         VARCHAR(20) DEFAULT 'pending',  -- payment:  pending | paid | failed
  delivery_status VARCHAR(20) DEFAULT 'new',     -- shipping: new | preparing | shipped | delivered | cancelled
  payment_ref    VARCHAR(120),                   -- payment id from the gateway
  card_brand     VARCHAR(20),                    -- visa | mastercard
  card_last4     VARCHAR(4),
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  paid_at        DATETIME NULL
);

-- ---------- Items inside each order ----------
CREATE TABLE IF NOT EXISTS order_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  order_id     INT NOT NULL,
  product_id   INT,
  product_name VARCHAR(150),
  price        DECIMAL(10,2) NOT NULL,
  quantity     INT NOT NULL DEFAULT 1,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =============================================
--  Dashboard users  (change the passwords from the "Users" page!)
--    admin@tuana.com  /  change-me-123   -> admin (everything)
--    staff@tuana.com  /  staff-123       -> staff (products + categories)
-- =============================================
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@tuana.com', '$2a$10$BG1NyyLYKrmwp0Z3msZxzOFNIjqL4k0Y1XPOOL6NoWOHX2oT0InjG', 'admin'),
('Staff', 'staff@tuana.com', '$2a$10$FtMOtXyJjohN6qzpEyCYnuDTjemxxMqfWXy2u1nIM1FyS1A9Phoxm', 'staff');

INSERT INTO categories (slug, name_ar, name_en) VALUES
('oud', 'عود', 'Oud'),
('khumra', 'خمرة', 'Khumra'),
('perfume', 'عطور', 'Perfumes'),
('bakhoor', 'بخور', 'Bakhoor');

-- =============================================
--  Sample products (you can edit / delete them)
-- =============================================
INSERT INTO products (name_ar, name_en, description_ar, description_en, category, price, size, color) VALUES
('عود ملكي',       'Oud Reale',        'عود كمبودي معتّق بلمسة من الورد الطائفي.',          'Aged Cambodian oud, softened with a whisper of Taif rose.',         'oud',     2450, '50 ml', '#5B3A1E'),
('دهن العود الأسود', 'Nero di Oud',      'دهن عود خالص، عميق وداخن يدوم طويلاً.',              'Pure oud oil — deep, smoky and endlessly long-lasting.',            'oud',     3200, '12 ml', '#2E1F17'),
('خمرة الشيوخ',     'Khumra Sultana',   'خمرة مخملية من العنبر والمسك والزعفران.',            'A velvet khumra of amber, musk and precious saffron.',              'khumra',  1350, '60 g',  '#8C3B2E'),
('خمرة الورد',      'Khumra di Rosa',   'خمرة ناعمة بالورد الدمشقي والفانيليا.',              'Soft khumra of Damascene rose and warm vanilla.',                   'khumra',  1150, '60 g',  '#B5654A'),
('مسك الطهارة',     'Musk Bianco',      'مسك أبيض نقي ناعم كالحرير.',                          'Pure white musk, clean and soft as silk.',                          'perfume',  890, '100 ml', '#C9B79C'),
('عنبر الصحراء',    'Ambra del Deserto','عنبر دافئ مع الهيل وخشب الصندل.',                    'Warm amber with cardamom and sandalwood.',                          'perfume', 1650, '100 ml', '#B8893B'),
('ليالي الشرق',     'Notte d''Oriente', 'عطر ليلي من العود والباتشولي والجلد.',                'A night perfume of oud, patchouli and soft leather.',               'perfume', 1980, '75 ml',  '#3E4A5C'),
('بخور الحرمين',    'Bakhoor Antico',   'بخور فاخر بقطع العود والعنبر لتعطير البيت.',          'Fine bakhoor of oud chips and amber, to perfume the home.',         'bakhoor',  750, '40 g',   '#6F4E37');

-- =============================================
--  Demo orders (so the dashboard is not empty)
--  Delete them later with:  DELETE FROM orders;
-- =============================================
INSERT INTO orders (customer_name, email, phone, city, address, total, status, payment_ref, card_brand, card_last4, created_at, paid_at) VALUES
('أحمد محمود',   'ahmed@mail.com',  '01001234567', 'القاهرة',   'مدينة نصر',     4900, 'paid',    'demo_1', 'visa',       '4242', DATE_SUB(NOW(), INTERVAL 0 DAY),  DATE_SUB(NOW(), INTERVAL 0 DAY)),
('Sara Ali',     'sara@mail.com',   '01112223334', 'Alexandria','Smouha',        1350, 'paid',    'demo_2', 'mastercard', '5454', DATE_SUB(NOW(), INTERVAL 1 DAY),  DATE_SUB(NOW(), INTERVAL 1 DAY)),
('محمد خالد',    'mo@mail.com',     '01223334445', 'الجيزة',    'الدقي',         3200, 'paid',    'demo_3', 'visa',       '1881', DATE_SUB(NOW(), INTERVAL 2 DAY),  DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Nour Hassan',  'nour@mail.com',   '01554445556', 'Cairo',     'Zamalek',       1980, 'failed',  'demo_4', 'visa',       '0002', DATE_SUB(NOW(), INTERVAL 3 DAY),  NULL),
('ياسمين علي',   'yasmin@mail.com', '01005556667', 'المنصورة',  'شارع الجمهورية', 2300, 'paid',    'demo_5', 'mastercard', '4444', DATE_SUB(NOW(), INTERVAL 4 DAY),  DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Omar Fathy',   'omar@mail.com',   '01116667778', 'Cairo',     'New Cairo',     890,  'pending', 'demo_6', NULL,         NULL,   DATE_SUB(NOW(), INTERVAL 5 DAY),  NULL),
('هالة سمير',    'hala@mail.com',   '01227778889', 'طنطا',      'سعيد',          5650, 'paid',    'demo_7', 'visa',       '4242', DATE_SUB(NOW(), INTERVAL 7 DAY),  DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Karim Adel',   'karim@mail.com',  '01558889990', 'Giza',      'Sheikh Zayed',  1650, 'paid',    'demo_8', 'mastercard', '9876', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('منى إبراهيم',  'mona@mail.com',   '01009990001', 'الإسكندرية','ميامي',         750,  'paid',    'demo_9', 'visa',       '1111', DATE_SUB(NOW(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 13 DAY)),
('Youssef Samy', 'youssef@mail.com','01110001112', 'Cairo',     'Maadi',         2450, 'paid',    'demo_10','visa',       '3333', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY));

-- shipping status of the demo orders
UPDATE orders SET delivery_status = 'delivered' WHERE id IN (7, 8, 9, 10);
UPDATE orders SET delivery_status = 'shipped'   WHERE id IN (3, 5);
UPDATE orders SET delivery_status = 'preparing' WHERE id IN (2);

INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES
(1, 1, 'Oud Reale', 2450, 2),
(2, 3, 'Khumra Sultana', 1350, 1),
(3, 2, 'Nero di Oud', 3200, 1),
(4, 7, 'Notte d''Oriente', 1980, 1),
(5, 4, 'Khumra di Rosa', 1150, 2),
(6, 5, 'Musk Bianco', 890, 1),
(7, 2, 'Nero di Oud', 3200, 1),
(7, 1, 'Oud Reale', 2450, 1),
(8, 6, 'Ambra del Deserto', 1650, 1),
(9, 8, 'Bakhoor Antico', 750, 1),
(10, 1, 'Oud Reale', 2450, 1);
