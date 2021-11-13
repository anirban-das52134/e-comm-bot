const UserModel = require('../model/userSchema');

module.exports.addUser = async function(userObj) {
    var newUser = new UserModel(
        {
            customerName: userObj.name,
            customerEmail: userObj.email,
            customerMobile: userObj.mobile,
            customerAddress: userObj.address,
            customerPostal: userObj.post
        });
    await newUser.save();
    return newUser;
};
