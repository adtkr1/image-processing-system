const pool = require('../config/db');

const createImage = async (requestId, inputUrl) => {
  const result = await pool.query(
    'INSERT INTO images (request_id, input_url, status) VALUES ($1, $2, $3) RETURNING id',
    [requestId, inputUrl, 'Pending']
  );
  return result.rows[0].id;
};

const updateImageUrl = async (imageId, outputUrl) => {
  await pool.query('UPDATE images SET output_url = $1, status = $2 WHERE id = $3', [
    outputUrl,
    'Completed',
    imageId,
  ]);
};

const getImagesByRequestId = async (requestId) => {
  const result = await pool.query('SELECT * FROM images WHERE request_id = $1', [requestId]);
  return result.rows;
};

module.exports = { createImage, updateImageUrl, getImagesByRequestId };
