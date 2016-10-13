var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var urls = new Schema({
  id: ObjectId,
  url: { type: String, required: true },
  baseUrl: { type: String },
  code: String,
  title: { type: String, required: true },
  visits: { type: Number, default: 0 },
  timestamps: {}
});

urls.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Link = db.model('Link', urls);

module.exports = Link;
