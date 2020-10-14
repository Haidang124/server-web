const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
// const mongoosePaginate = require('mongoose-will-paginate');
// const SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

var userSchema = Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    firstname: { type: String },
    lastname: { type: String },
    avatar: { type: String, default : 'https://api.hoclieu.vn/images/game/bbfb3597f173af631cb24f6ee0f8b8da.png' },
    role: { type: String, default: 'member' },
    language: { type: String, default: 'vi' },
    verify_teacher: { type: Number },
    username: { type: String, maxlength: 128 },
    birthday: { type: Date },
    display_first_name: { type: String, maxlength: 128 },
    display_last_name: { type: String, maxlength: 128 },
  },
  { timestamps: true }
);
// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;