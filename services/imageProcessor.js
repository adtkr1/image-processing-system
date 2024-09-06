const sharp = require('sharp');
const axios = require('axios');

const processImage = async (inputUrl) => {
  const response = await axios({
    url: inputUrl,
    responseType: 'arraybuffer',
  });

  const imageBuffer = Buffer.from(response.data, 'binary');
  const processedImageBuffer = await sharp(imageBuffer)
    .resize({ width: Math.floor(response.data.width / 2) })
    .toBuffer();

  return processedImageBuffer;
};

module.exports = { processImage };