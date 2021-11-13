var mongoose = require('mongoose');
var ProductSchema = mongoose.Schema({
    productName: String,
    productDesc: String,
    productPrice: Number,
    productUrl: String
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
