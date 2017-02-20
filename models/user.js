/*jshint esversion: 6*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Biography = require('./bio');

const userSchema = Schema({
  username: String,
  password: String,
},{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
