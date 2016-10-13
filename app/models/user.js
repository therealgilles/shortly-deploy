var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var users = new Schema({
  id: ObjectId,
  username: { type: String, unique: true, required: true, dropDups: true },
  password: { type: String, required: true },
  timestamps: {}
});

users.pre('save', function(next) {
  this.password = bcrypt.hashSync(this.password);
  next();
});

users.methods.comparePassword = function(attemptedPassword) {
  return bcrypt.compareSync(attemptedPassword, this.password);
};

var User = db.model('User', users);


// User.pre('find', function(next) {
//   var hashedPassword;
//   if (this.password) {
//     hashedPassword = bcrypt.hashSync(this.password);
//   }
//
//   bcrypt.compareSync(this.password, )
// });

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

module.exports = User;
