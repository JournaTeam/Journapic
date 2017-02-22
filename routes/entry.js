const express      = require('express');
const router       = express.Router();
const passport     = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const Entry = require('../models/entry');

router.get('/new', ensureLoggedIn('/'), function(req, res, next) {
    res.render('./entry/new', {req});
});

router.post('/', ensureLoggedIn('/'), function(req, res, next) {
  console.log(req.body);
  const newEntry = new Entry({
      picture: req.body.picture,
      comment: req.body.comment,
      location: req.body.location,
      _creator: req.user._id,
      achieved: typeof(req.body.notAchieved)!=='string'
    });

    newEntry.save( (err) => {
      if (err) {
        res.render('entry/new', {req});
      } else {
        res.redirect('/');
      }
    });





});

module.exports = router;
