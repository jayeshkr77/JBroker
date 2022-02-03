const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String
    },
    pin:{
        type:String
    },
    verified:{
        type:Boolean
    },
    joinDate:{
        type:Date
    },
    trackingStocks:{
        type: Array,
        default: []
    },

});

const User = mongoose.model('users', userSchema);
module.exports = User;