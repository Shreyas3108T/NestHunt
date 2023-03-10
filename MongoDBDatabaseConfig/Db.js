const mongoose = require('mongoose');
require("dotenv").config()

const uri1 = process.env.DATABASE_URL;
const uri2 = process.env.DATABASE_DEV_HELP;

const options = {
  useNewUrlParser: true
};

exports.MainDb = mongoose.createConnection(uri1,options)
exports.DevDb = mongoose.createConnection(uri2,options)
// mongoose.connect(uri, options)
//   .then(() => {
//     console.log('Connected to database');
//   })
//   .catch((err) => {
//     console.log('Error connecting to database:', err);
//   });

// module.exports = mongoose.connection;
// exports.MainDb
// exports.DevDb
