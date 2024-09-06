const pool = require('../config/db');

const createProduct = async (productName) => {
  const result = await pool.query(
    'INSERT INTO products (product_name) VALUES ($1) RETURNING id',
    [productName]
  );
  return result.rows[0].id;
};

module.exports = { createProduct };
