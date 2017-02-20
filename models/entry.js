/*jshint esversion: 6*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = Schema({
  date: Date,
  location: String,
  picture: String,
  textEmoji: String,
},{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
