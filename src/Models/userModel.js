const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email:{type: String, required: true, unique: true },
  contactNo:{type:String,required:true},
  profile:{type:String},
  role: { type: String, enum: ['admin', 'superadmin', 'user'], default: 'user' },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  seller:{
    type:Boolean,
    required:false,
    default:false,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  lastMessage: {
    type: Date
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
