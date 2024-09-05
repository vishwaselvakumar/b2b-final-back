const multer = require('multer');
const mongoose = require('mongoose');
const Product = require('../Models/productModel');
// const Category = require('../models/category');

// Configure multer to store the image in memory

let bucket;
mongoose.connection.on('connected', () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Configure multer to store the image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.addProduct = async (req, res) => {
  try {
    upload.single('image')(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      const { name, price, quantity, description, brand, category,categories } = req.body;

      const uploadStream = bucket.openUploadStream(req.file.originalname);
      uploadStream.end(req.file.buffer);

      uploadStream.on('finish', async () => {
        // console.log('File uploaded successfully.');

        const newProduct = new Product({
          image: `uploads/${req.file.originalname}`,
          name,
          price,
          quantity,
          description,
          brand,
          category,
          categories,
          imageId: uploadStream.id,
        });

        const savedProduct = await newProduct.save();
        // console.log('Saved Product:', savedProduct);

        res.status(201).json({
          message: 'Product added successfully',
          product: savedProduct,
        });
      });
    });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Error saving product', details: error.message });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category'); // Populate if `category` is a reference
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products', details: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Error fetching product', details: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // console.log(categoryId)
    
    // Validate categoryId
    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    // Fetch products by category ID
    const products = await Product.find({ category: categoryId }).populate('category');
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
};
// Get an image by filename
exports.getImage = (req, res) => {
  const { filename } = req.params;
  // console.log('Fetching image:', filename);
  
  const downloadStream = bucket.openDownloadStreamByName(filename);

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('end', () => {
    res.end();
  });

  downloadStream.on('error', (error) => {
    console.error('Error fetching image:', error);
    res.status(404).json({ error: 'Image not found' });
  });
};
