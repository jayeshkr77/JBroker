const serverSetup = require('../utilites/setupServerUtilities');
const stockDataSync = require('../utilites/stockDataSync');

function dataSyncMiddleware(req, res, next) {
    serverSetup.lastReq = new Date();
    stockDataSync();
    next();
}

module.exports = dataSyncMiddleware;