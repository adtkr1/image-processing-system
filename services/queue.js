const Queue = require('bull');
require('dotenv').config();

const imageQueue = new Queue('image processing', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
});

imageQueue.process(__dirname + '/../workers/imageWorker.js');

module.exports = imageQueue;
