const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StockSchema = new Schema({
    stockSymbol:{
        type:String
    },
    currentPrice:{
        type: Number,
    },
});

const Stock = mongoose.model('stocks', stockSchema);
module.exports = Stock;