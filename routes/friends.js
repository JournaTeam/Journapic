const express      = require('express');
const router       = express.Router();
const passport     = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const Entry        = require('../models/entry');
const User        = require('../models/user');
const Friends        = require('../models/friends');
const multer       = require('multer');
const upload       = multer({ dest: './public/uploads/' });

router.get('/', ensureLoggedIn(), function(req, res, next) {
  Friends.find({ $and: [ { $or: [{ requester : req.user._id },{ receiver : req.user._id }] }, { status : 'accepted' } ] })
  .populate('requester')
  .populate('receiver')
  .exec(function (err, friends){
    if (err) { res.redirect('/new'); }
    res.render('./friends/index', {req, friendRequests: res.locals.notifics, friends});
  });
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
        res.redirect('/friends');
      }
    });
  });
});

router.get('/new', ensureLoggedIn('/login'), function(req, res, next) {
  Friends.find({ $and: [ { requester : req.user._id } , { status : 'pending' } ] })
  .populate('requester')
  .populate('receiver')
  .exec(function (err, friends){
    if (err) { res.redirect('/friends'); }
    res.render('./friends/new', {req, awaitingRequests : friends});
  });
});

router.post('/decision', ensureLoggedIn('/login'), (req, res) => {
  console.log(req.body);
  const {friendshipID, decision} = req.body;
  const update = {
    status: req.body.decision,
  };

  Friends.findByIdAndUpdate( { _id: friendshipID } , update , (err, friendship) => {
    if (err) { return res.render('./friends/index', { req , friendRequests: res.locals.notifics , message: 'Error replying request' }); }
    return res.redirect("/friends");
  });

});

router.post('/delete', ensureLoggedIn('/login'), (req, res) => {
  const {friendshipID} = req.body;
  Friends.findByIdAndRemove( friendshipID, (err, friendship) => {
    if (err) { return res.render('./friends/index', { req , friendRequests: res.locals.notifics , message: 'Error removing friend' }); }
    return res.redirect("/friends");
  });
});

module.exports = router;
