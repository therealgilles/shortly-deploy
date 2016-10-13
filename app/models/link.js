var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var urls = new Schema({
  id: ObjectId,
  url: { type: String, required: true },
  baseUrl: { type: String, required: true },
  code: String,
  title: { type: String, required: true },
  visits: { type: Number, default: 0 },
  timestamps: {}
});

var Link = db.model('Link', urls);

Link.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;
