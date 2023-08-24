const mongoose = require('mongoose');
const monpin = 'mongodb://127.0.0.1:27017/';

const connecttomongo = () => {
  mongoose
    .connect(monpin,{ 
        useNewUrlParser: true,
        useUnifiedTopology: true})
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
};

module.exports = connecttomongo;



