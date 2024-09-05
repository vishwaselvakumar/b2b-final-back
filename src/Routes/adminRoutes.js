const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controller/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, superAdminOrAdmin } = require('../middleware/roleMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, superAdminOrAdmin, getAllUsers);

router.route('/:id')
  .get(protect, superAdminOrAdmin, getUserById)
  .put(protect, superAdminOrAdmin, updateUser)
  .delete(protect, adminOnly, deleteUser);

module.exports = router;
