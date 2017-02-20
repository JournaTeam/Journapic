/*jshint esversion: 6*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Entry = require('./entry');

const bioSchema = Schema({
  user: Schema.Types.ObjectId,
  entries: [Entry.schema],
},{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Biography = mongoose.model('Biography', bioSchema);

module.exports = Biography;

//Dudas: para que sirve timestamps?
//Como organizar, nestear o referenciar al id?
//Como hacer parte de usuarios amigos de otros usuarios?
//user -> bio -> entries
