const logger = require('../utilites/logger');

function loggerMiddleware(req,res,next){
    res.on('finish', function() {
        logger.info(`${res.statusCode} ${req.originalUrl} - ${req.method} - ${req.ip} - ${(Object.keys(req.headers).map(header => `${header}:${req.headers[header]}`)).join(', ').trim()}`);
    });
    next();
}
module.exports = loggerMiddleware;
