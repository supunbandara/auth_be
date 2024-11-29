const { connection, config } = require('./config/connection');
const express = require('express');
const app = express();
const routeHandler = require('./src/routes/index');
const { checkTables } = require('./config/table');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  const allowedOrigins = [
      'https://www.zfrozen.in',
      'http://localhost:3001',
      'http://zposdevelop.s3-website-ap-southeast-1.amazonaws.com',
      'http://zposdashboarddevelop.s3-website-ap-southeast-1.amazonaws.com',
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token, access-token'); // Include 'x-token' header
  next();
});

app.use('/api', routeHandler(config));

app.all('*', (req, res) => {
  res.status(404).send({
    error: 'resource not found',
  });
});

const server = app.listen(config.port, () => {
  console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
  checkTables();
});
