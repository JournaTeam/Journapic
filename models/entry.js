/*jshint esversion: 6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
    _creator : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    published : Boolean,
    picture : String,
    comment : String,
    location : String
  },{
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
