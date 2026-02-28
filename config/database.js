const mongoose = require('mongoose');

const dbConnection = () => {
    console.log("DB_URI:", process.env.DB_URI);
    // connect to MongoDB
    mongoose.connect(process.env.DB_URI).then((conn) => {
    // mongoose.connect('mongodb:://localhost:27017/EcommerceDB').then((conn) => {
        console.log(`Connected to MongoDB successfully : ${conn.connection.host}`);
    })
    // .catch(err => {
    //     console.error('Error connecting to MongoDB', err);
    // });
}


module.exports = dbConnection;