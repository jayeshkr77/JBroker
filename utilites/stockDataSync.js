const serverSetup = require('./setupServerUtilities');
const logger = require('./logger');

function stockDataSync() {

    // last request was before 5 mins, put the timer off.
    if (!serverSetup.timer) {
        serverSetup.timer = setInterval(async () => {
            if ((new Date() - serverSetup.lastReq) > 300000) {
                logger.info(`Google sheet data sync stopped.`);
                clearInterval(serverSetup.timer);
                serverSetup.timer = null;
            } else {
                try {
                    const getRows = await serverSetup.googleSheets.spreadsheets.values.get({
                        auth: serverSetup.auth,
                        spreadsheetId: process.env.SPREADSHEET_ID,
                        range: 'Sheet1',
                    });
                    logger.info(`Google sheet data sync ran.`);
                    getRows.data.values.forEach(row => {
                        if (row[0].length) {
                            serverSetup.redisClient.set(row[0], row[1]);
                        }
                    });
                } catch (err) {
                    logger.error(`${err.name} ${err.message}`);
                }
            }
        }, 60000);
        logger.info(`Google sheet data sync started.`);
    } else {
        logger.info(`Google sheet data sync already runnning.`);
    }
}

module.exports = stockDataSync;