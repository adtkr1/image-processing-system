const express = require('express');
const multer = require('multer');
const { createRequest, updateRequestStatus, getRequestStatus } = require('../models/request');
const { createProduct } = require('../models/product');
const { createImage, getImagesByRequestId } = require('../models/image');
const imageQueue = require('../services/queue');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const { file } = req;
  const { originalname, path } = file;
  const lines = require('fs').readFileSync(path, 'utf-8').split('\n').filter(Boolean);

  const requestId = await createRequest('Processing');

  for (const line of lines) {
    const [serialNumber, productName, inputUrls] = line.split(',');

    const productId = await createProduct(productName);
    const urls = inputUrls.split(';');

    for (const url of urls) {
      const imageId = await createImage(requestId, url);
      imageQueue.add({ imageId, inputUrl: url });
    }
  }

  res.json({ requestId });
});

router.get('/status/:requestId', authMiddleware, async (req, res) => {
  const { requestId } = req.params;
  const status = await getRequestStatus(requestId);

  const images = await getImagesByRequestId(requestId);

  res.json({ status, images });
});

router.post('/webhook', authMiddleware, async (req, res) => {
  const { requestId, outputUrls } = req.body;

  // Update the database with the processed image URLs
  // ...

  await updateRequestStatus(requestId, 'Completed');
  res.sendStatus(200);
});

module.exports = router;
