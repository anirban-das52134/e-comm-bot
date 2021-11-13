const productsDB = require('./productDB');
const CartModel = require('../model/cartSchema');

module.exports.addItemToCart = async function(prodId, amt) {
    const data = await productsDB.getItemData(prodId);
    var newItem = new CartModel(
        {
            productID: prodId,
            productName: data.productName,
            productPrice: data.productPrice,
            productUrl: data.productUrl,
            productQuantity: amt
        });
    await newItem.save();
    return newItem;
};

module.exports.fetchCart = async function() {
    return CartModel.find({}).exec()
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(err.message);
        });
};

module.exports.checkExist = async function(id) {
    const item = await CartModel.findOne({ productID: id });
    if (item) return item.productQuantity;
    else return -1;
};

module.exports.updateItemQuantity = async function(id, amt) {
    const item = await CartModel.findOne({ productID: id });
    item.productQuantity = amt;

    await item.save();
    return item;
};

module.exports.deleteItem = async function(orderId) {
    return CartModel.deleteOne({ _id: orderId })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.deleteAll = async function(orderId) {
    return CartModel.deleteMany();
};
