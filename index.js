const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const logger = require('./utilites/logger');
const loggerMiddleware = require('./middlewares/logger');

const {serverSetup} = require('./utilites/setupServerUtilities');
const apiRouter = require('./routes/api');

let app = express();
let PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(loggerMiddleware);

app.get('/', async (req, res, next) => {
    await serverSetup.client.set('key', 'value2');
    res.send('Works');
    next();
})
app.get('/t', async (req, res) => {
    const value = await serverSetup.client.get('key');
    res.send(value)
})

app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", (req, res, next) => {
    res.status(404).json({ "message": "Url not found." });
});


app.listen(PORT, () => {
    logger.info(`This is a ${process.env.NODE_ENV} server.`)
    logger.info(`Server has started ${process.env.SERVER_URL}:${PORT}`);
});
