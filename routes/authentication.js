const express      = require('express');
const router       = express.Router();
const passport     = require('passport');
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

module.exports = router;
