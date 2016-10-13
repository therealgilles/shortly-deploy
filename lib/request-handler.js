var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    if (err) {
      return res.sendStatus(500);
    }
    res.status(200).send(links);
  });

  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({ url: uri }, function(err, link) {
    if (err) {
      return res.sendStatus(500);
    }

    if (link) {
      res.status(200).send(link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        Link.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        }, function(err, newLink) {
          if (err) {
            return res.sendStatus(500);
          }
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      res.redirect('/login');
    } else {
      if (user.comparePassword(password)) {
        util.createSession(req, res, user);
      } else {
        res.redirect('/login');
      }
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      User.create({
        username: username,
        password: password
      }, function(err, newUser) {
        if (err) {
          return res.sendStatus(500);
        }
        util.createSession(req, res, newUser);
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (err) {
      return res.sendStatus(500);
    }

    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function (err) {
        if (err) {
          return res.sendStatus(500);
        } else {
          return res.redirect(link.url);
        }
      });
    }
  });
};