/*jshint esversion: 6*/

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/journapic');
const User = require('../models/user.js');

const users = [
  {
    username: 'Tuno@Tuno.com',
    password: 'TunoPassword',
  },
  {
    username: 'carlos@carlos.com',
    password: 'carlosPassword',
  },
  {
    username: 'juan@juan.com',
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
