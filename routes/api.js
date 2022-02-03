const express = require('express');
const trackRouter = require('./track');

const app = express();

app.use('/track/',trackRouter);

module.exports = app;