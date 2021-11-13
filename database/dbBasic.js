const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectionString = `mongodb+srv://${ process.env.DB_USERNAME }:${ process.env.DB_PASSWORD }@cluster0.51zag.mongodb.net/${ process.env.DB_NAME }`;
module.exports.CheckConnection = async () => {
    try {
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database Connected!');
    } catch (err) {
        console.log('Database Connection Faliure!');
        console.log(err.message);
        process.exit(1);
    }
};
