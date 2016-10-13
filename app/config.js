var path = require('path');
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://127.0.0.1:27017/my_database');
db.on('error', console.error('mongodb connection error'));
db.on('open', console.log('connected to mongodb'));

module.exports = db;
