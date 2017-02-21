const express      = require('express');
const router       = express.Router();
const passport     = require('passport');
const User         = require('../models/user');
const Entry        = require('../models/entry');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

function ensureAuthenticator(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    res.render('landing', {req});
  }
}

router.get('/', ensureAuthenticator, function(req, res, next) {
    res.render('index', {req});
});

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('./auth/signup', {req});
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('./auth/login', {req});
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login'
}));

router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/:username', ensureLoggedIn(), (req, res) => {
    var usernameParam = req.params.username;
    if (usernameParam === req.user.username) {
      User.findOne({ username : usernameParam }, function (err, result){
        if (err) { return next(err); }
        var id = result._id;
        Entry.find({ _creator : id }, function(err, arrayOfEntries){
          if (err) { return next(err); }
          res.render('bio', {req, arrayOfEntries, usernameParam});
        });
      });
    }else{
      res.redirect('/');
    }
});


module.exports = router;
