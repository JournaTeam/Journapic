const express      = require('express');
const router       = express.Router();
const passport     = require('passport');
const User         = require('../models/user');
const Entry        = require('../models/entry');
const Friends      = require('../models/friends');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

function ensureAuthenticator(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    res.render('landing', {req});
  }
}

router.get('/', ensureAuthenticator, function(req, res, next) {
  console.log("EStamos en authentication y debajo va notifics");
  console.log(res.locals.notifics);
    res.render('index', {req, notifications: res.locals.notifics});
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

router.post('/', ensureLoggedIn('/login'), (req, res) => {
  const friendUserName = req.body.username;
  User.findOne({ username : friendUserName }, function (err, result){
    if (err) { res.redirect('/add'); }    //Darle una vuelta
    const newFriendship = new Friends({
      requester : req.user._id,
      receiver : result._id,
      status : 'pending'
    });
    newFriendship.save( (err) => {
      if (err) {
        res.render('/add', {req});
      } else {
        res.redirect('/');
      }
    });
  });
});

router.get('/add', ensureLoggedIn(), function(req, res, next) {
  res.render('add', {req});
});

router.get('/:username', ensureLoggedIn(), (req, res) => {
    const usernameParam = req.params.username;
    if (usernameParam === req.user.username) {
      User.findOne({ username : usernameParam }, function (err, result){
        if (err) { return next(err); }
        const id = result._id;
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
