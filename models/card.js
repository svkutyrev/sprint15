const mongoose = require('mongoose');

const url = /^(http:\/\/|https:\/\/|ftp:\/\/|ftps:\/\/|www\.)([0-9]|[a-z]|[A-Z]|[.*]|[-]|[_])+(\.)+([a-z]|.*)/i;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    match: url,

  },
  owner: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
