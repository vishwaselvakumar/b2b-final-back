const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  imageId: mongoose.Schema.Types.ObjectId,
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
