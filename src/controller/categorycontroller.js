const Category = require('../Models/category'); // Adjust the path as needed
const mongoose = require('mongoose');
const multer = require('multer');
// Create a new category
// Create a new category
let bucket;
mongoose.connection.on('connected', () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Configure multer to store the image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
exports.createCategory = async (req, res) => {
  try {
    // Use a promise wrapper to handle the upload as an async operation
    await new Promise((resolve, reject) => {
      upload.single('image')(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const uploadStream = bucket.openUploadStream(req.file.originalname);
    uploadStream.end(req.file.buffer);

    // Handle the upload completion
    uploadStream.on('finish', async () => {
      try {
        // console.log('File uploaded successfully.');

        const newCategory = new Category({
          image: `uploads/${req.file.originalname}`,
          name,
          imageId: uploadStream.id,
        });

        await newCategory.save();

        res.status(201).json({ message: 'Category created successfully', newCategory });
      } catch (error) {
        console.error('Error saving category:', error);
        res.status(500).json({ message: 'Error creating category', error });
      }
    });

    // Handle upload error
    uploadStream.on('error', (error) => {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Error uploading file', error });
    });

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error creating category', error });
  }
};


// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ message: 'Error retrieving categories', error });
  }
};
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
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error retrieving category by ID:', error);
    res.status(500).json({ message: 'Error retrieving category by ID', error });
  }
};
