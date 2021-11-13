const mongoose = require('mongoose');

const userScheama = new mongoose.Schema({
    customerName: {
        type: String,
        require: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerMobile: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
    },
    customerPostal: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user', userScheama);
