var path = require('path');
var mongoose = require('mongoose');

var dbPort = process.env.DB_PORT || 27017;
var dbHost = process.env.DB_HOST || '127.0.0.1';
var db = mongoose.createConnection(`mongodb://${dbHost}:${dbPort}/shortly`);
db.on('error', function(err) {
  console.error('mongodb connection error', err);
});
db.on('open', function() {
  console.log('connected to mongodb');
});

db.on('disconnected', function () {
  console.log('Mongoose is disconnected');
});

var gracefulExit = function() { 
  db.close(function () {
    console.log('Mongoose is disconnected through app termination');
    process.exit(0);
  });
};

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

module.exports = db;
