var mongoose = require('mongoose');
var CartSchema = mongoose.Schema({
    productID: String,
    productName: String,
    productPrice: Number,
    productUrl: String,
    productQuantity: Number
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
