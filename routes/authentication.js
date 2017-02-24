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
    Friends.find({ $and: [ { $or: [{ requester : req.user._id },{ receiver : req.user._id }] }, { status : 'accepted' } ] })
    .populate('requester')
    .populate('receiver')
    .exec(function (err, friends){
      friends = friends.map(function(elem){if(elem.requester._id===req.user._id){return elem.receiver;}else{return elem.requester;}});
      const friendIDs = friends.map(function(elem){return elem._id;});
      Entry.find( { _creator : { $in : friends } })
      .populate('_creator')
      .sort([['updated_at', -1]])
      .exec(function(err, entries){
        if(err){return next(err);}
        res.render('index', {req, notifications: res.locals.notifics, entries});
      });
    });
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
    function renderBio(username){
      User.findOne({ username }, function (err, result){
        if (err) { return next(err); }
        const id = result._id;
        Entry.find({ _creator : id })
        .sort([['updated_at', -1]])
        .exec( function(err, arrayOfEntries){
          if (err) { return next(err); }
          res.render('bio', {req, arrayOfEntries, usernameParam : username, notifications: res.locals.notifics});
        });
      });
    }

    const friend = req.params.username;
    console.log("asjjsdadjfdjf");
    console.log("esto es req.params.username", req.params.username);
    if (friend === req.user.username) {
      return renderBio(friend);
    }else{
      User.findOne({"username": friend}, function(err, result){
        if (err) { res.redirect('/friends'); }
        const friendID = result._id;
        const cond1 = {$and:[{ requester : req.user._id }, { receiver : result._id }]};
        const cond2 = {$and:[{ receiver : req.user._id }, { requester : result._id }]};
        Friends.findOne({ $and: [ { $or: [ cond1, cond2] }, { status : 'accepted' } ] })
        .populate('requester')
        .populate('receiver')
        .exec(function (err, friendshipObj){
          if (err) { res.redirect('/new'); }
          if (friendshipObj) {
            return renderBio(friend);
          }else{
            res.redirect('/friends');
          }
        });
      });
  }
});



module.exports = router;
