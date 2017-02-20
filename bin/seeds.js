/*jshint esversion: 6*/

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/journapic');
const User = require('../models/user.js');

const users = [
  {
    username: 'Saturnini',
    email: 'Tuno@Tuno.com',
    password: 'TunoPassword',
  },
  {
    username: 'Carlini',
    email: 'carlos@carlos.com',
    password: 'carlosPassword',
  },
  {
    username: 'juanini',
    email: 'juan@juan.com',
    password: 'juanPassword',
  },
];

User.create(users, (err, docs) => {
  if (err) { throw err; }
  docs.forEach( (user) => {
    console.log(user.username);
  });
  mongoose.connection.close();
});
