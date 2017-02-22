const express      = require('express');
const router       = express.Router();
const passport     = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const Entry        = require('../models/entry');
const Friends        = require('../models/friends');
const multer       = require('multer');
const upload       = multer({ dest: './public/uploads/' });

router.get('/', ensureLoggedIn(), function(req, res, next) {
  res.render('./friends/index', {req, friendRequests: res.locals.notifics});
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
  res.render('./friends/new', {req});
});

router.post('/decision', ensureLoggedIn('/login'), (req, res) => {
  console.log(req.body);
  const {friendshipID, decision} = req.body;
  const update = {
    status: req.body.decision,
  };

  Friends.findByIdAndUpdate( { _id: friendshipID } , update , (err, friendship) => {
    if (err) { return res.render('./friends/index', { req , friendRequests: res.locals.notifics , message: 'Error replying request' }); }
    return res.render(`./friends/index`, { req , friendRequests: res.locals.notifics , message: 'Decision saved correctly' });
  });

});

module.exports = router;
