const mongoose = require('mongoose');
// const Category = require('./category');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  description: String,
  brand: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Reference to Category
  categories:String,
  image: String,
  imageId: mongoose.Schema.Types.ObjectId,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
