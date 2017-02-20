/*jshint esversion: 6*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Biography = require('./bio');

const userSchema = Schema({
  name: {String},
  email: {String}, //<collectionName>.errors almacena estos errores
  password: {String},
  // biography: Biography.schema,
  // friends: [Schema.Types.ObjectId]
  // today: ???,
  // biography: [Schema.Types.ObjectId],
  // friends: [Schema.Types.ObjectId],
},{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
