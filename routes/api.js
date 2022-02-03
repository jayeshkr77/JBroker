const express = require('express');
const trackRouter = require('./track');
const userRouter = require('./user');

const app = express();

app.use('/track/',trackRouter);
app.use('/user/', userRouter);

module.exports = app;