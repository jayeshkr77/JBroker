const { google } = require('googleapis');
const { serverSetup } = require('../utilites/setupServerUtilities');

exports.trackStockPriceFromGoogleSheets = (req, res) => {
    res.json('called');
}