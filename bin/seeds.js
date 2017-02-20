/*jshint esversion: 6*/

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/journapic');
const User = require('../models/user.js');

const users = [
  {
    name: 'Tuno',
    email: 'Tuno@Tuno.com',
    password: 'TunoPassword',
  },
  {
    name: 'Carlos',
    email: 'carlos@carlos.com',
    password: 'carlosPassword',
  },
  {
    name: 'juan',
    email: 'juan@juan.com',
    password: 'juanPassword',
  },
];

User.create(users, (err, docs) => {
  if (err) { throw err; }
  docs.forEach( (user) => {
    console.log(user.name);
  });
  mongoose.connection.close();
});
