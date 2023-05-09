const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  password: {
    type: String,
    minlength: 2,
    required: true,
    select: false,
  },
  age: {
    type: Number,
    default: 0,
  },
  university: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
});

module.exports = mongoose.model('user', userSchema);
