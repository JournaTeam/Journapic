/*jshint esversion: 6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const STATUSES    = require('./friendship-statuses');

const friendsSchema = new Schema({
    requester : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status : { type: String, enum: STATUSES, required: true },
  },{
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Friends = mongoose.model('Friends', friendsSchema);

module.exports = Friends;
