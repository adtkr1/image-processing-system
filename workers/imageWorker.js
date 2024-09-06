const { processImage } = require('../services/imageProcessor');
const { updateImageUrl } = require('../models/image');
require('dotenv').config();

const imageWorker = async (job) => {
  const { imageId, inputUrl } = job.data;
  const processedImageBuffer = await processImage(inputUrl);

  // Save processed image to some storage service and get output URL
  const outputUrl = `http://storage-service.com/processed/${imageId}.jpg`;

  // Update image record with output URL
  await updateImageUrl(imageId, outputUrl);

  // Notify webhook if all images for the request are processed
  // Here, you could implement logic to check if all images are processed
};

module.exports = imageWorker;