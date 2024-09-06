const pool = require('../config/db');

const createRequest = async (status) => {
  const result = await pool.query(
    'INSERT INTO requests (status) VALUES ($1) RETURNING id',
    [status]
  );
  return result.rows[0].id;
};

const updateRequestStatus = async (requestId, status) => {
  await pool.query('UPDATE requests SET status = $1 WHERE id = $2', [status, requestId]);
};

const getRequestStatus = async (requestId) => {
  const result = await pool.query('SELECT status FROM requests WHERE id = $1', [requestId]);
  return result.rows[0].status;
};

module.exports = { createRequest, updateRequestStatus, getRequestStatus };
