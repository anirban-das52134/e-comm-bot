const ProductModel = require('../model/productSchema');

module.exports.fetchCatalog = async function() {
    return ProductModel.find({}).exec()
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports.getItemData = async function(prodId) {
    const item = await ProductModel.findOne({ _id: prodId });
    return item;
};
