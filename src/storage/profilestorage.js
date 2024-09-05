const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../Models/userModel');

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the 'uploads' directory exists
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Create a unique filename using timestamp and original extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Create a multer instance with the storage configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});


// Export the multer instance
exports.upload = upload;
