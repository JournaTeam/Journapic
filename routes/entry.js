const express      = require('express');
const router       = express.Router();
const passport     = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const Entry        = require('../models/entry');
const multer       = require('multer');
const upload       = multer({ dest: './public/uploads/' });


router.get('/new', ensureLoggedIn('/'), function(req, res, next) {
    res.render('./entry/new', {req});
});

router.post('/', [ensureLoggedIn('/login'), upload.single('file')], function(req, res, next) {
  const newEntry = new Entry({
      picPath: `/uploads/${req.file.filename}`,
      picName: req.file.originalname,
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
