const express      = require('express');
const router       = express.Router();
const passport     = require('passport');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

router.get('/signup', ensureLoggedOut(), (req, res) => {
    res.render('auth/signup', {req});
});

router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/auth/signup'
}));

router.get('/login', ensureLoggedOut(), (req, res) => {
    res.render('auth/login', {req});
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/auth/login'
}));

router.post('/logout', ensureLoggedIn('/auth/login'), (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
