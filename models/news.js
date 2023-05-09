const { Schema, model, default: mongoose } = require('mongoose');

const getStringData = () => {
  let format = new Date().toLocaleString('ru-RU', {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).replace(/\s*г\./, ""). split(' ');
  format[1] = format[1][0].toUpperCase() + format[1].slice(1);
  return format.join(' ')
}

const dataSchema = new Schema({
  date: {
    type: String,
    default: getStringData(),
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  owner: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
});

module.exports = model('news', dataSchema);