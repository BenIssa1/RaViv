/** @format */

const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect("mongodb+srv://raviv:4jjlGOwZ1dDsljAi@cluster0.lkpp6zt.mongodb.net/raviv-db?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;
