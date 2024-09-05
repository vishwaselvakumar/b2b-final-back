const User = require('../Models/userModel'); // Ensure this path is correct
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {profileupload}=require('../storage/profilestorage')
const path = require('path');
const fs = require('fs');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  const { username, password, role, email, contactNo } = req.body;

  try {
    const user = new User({ username, password, role, email, contactNo });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({ message: 'User logged in successfully', user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  // Since we are not using cookies, simply return a logout success message
  res.json({ message: 'User logged out successfully' });
};

exports.getUserData = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    username: user.username,
    role: user.role,
  });
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
      const userId = req.params.id;
      const updateData = { ...req.body }; // Spread the request body to updateData

      // Handle profile image upload if a file is provided
      if (req.file) {
          // Find the user by ID to get the current profile image
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          // Delete the old profile image if it exists
          if (user.profile) {
              const oldImagePath = path.join(__dirname, '../uploads', user.profile);
              if (fs.existsSync(oldImagePath)) {
                  fs.unlinkSync(oldImagePath); // Remove the old image from the server
              }
          }

          // Update the profile image field in updateData
          updateData.profile = req.file.filename;
      }

      // Update the user with new data
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
          message: 'User updated successfully',
          user: updatedUser,
      });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.uploadProfileImage = async (req, res) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Find the user by ID
        const userId = req.params.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the old profile image if it exists
        if (user.profileImage) {
            const oldImagePath = path.join(__dirname, '../uploads', user.profileImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Remove the old image from the server
            }
        }

        // Update the user's profile image
        user.profileImage = req.file.filename;
        await user.save();

        res.status(200).json({
            message: 'Profile image uploaded successfully',
            profileImage: req.file.filename,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // console.log(userId)
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]).sort({ lastMessage: -1 });
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

// module.exports.logOut = (req, res, next) => {
//   try {
//     if (!req.params.id) return res.json({ msg: "User id is required " });
//     // onlineUsers.delete(req.params.id);
//     return res.status(200).send();
//   } catch (ex) {
//     next(ex);
//   }
// };