const express = require('express');
const router = express.Router();
const os = require('os');

router.get('/', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
      },
      cpu: os.cpus()[0].model,
      hostname: os.hostname()
    }
  };
  
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

module.exports = router;
