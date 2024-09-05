const jwt = require('jsonwebtoken');
const User = require('../Models/userModel'); // Ensure this path is correct

const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token is found, return an unauthorized error
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and exclude the password from the result
    req.user = await User.findById(decoded.id).select('-password');

    // If the user doesn't exist, return a not found error
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
