const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const { use } = require('../routers/usersRouter');
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
    username: { type: String, maxlength: 128 },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Minimum password length is 6 characters'],
    },
    avatar: { type: String, default : 'https://api.hoclieu.vn/images/game/bbfb3597f173af631cb24f6ee0f8b8da.png' },
    role: { type: String, default: 'member' },
    language: { type: String, default: 'vi' },
    birthday: { type: Date },
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

userSchema.statics.updateFields = async function(user_id, data)  {
  // data: {newUsername, newAvatar, newLanguage, newBirthday}
  const query = await this.updateOne({_id: user_id},{$set: {username: data.newUsername, avatar: data.newAvatar, language: data.newLanguage, birthday: data.newBirthday}});
  if(query) {
    return query;
  }
  throw Error("Update error!");
}

userSchema.statics.changePassword = async function(user_id, _newPassword)  {
  const salt = await bcrypt.genSalt();
  const newPassword = await bcrypt.hash(_newPassword, salt);
  const query = await this.updateOne({_id: user_id},{$set: {password: newPassword}});
  if(query) {
    return query;
  }
  throw Error("Update password ERROR!");
}

userSchema.statics.checkNewData = async function(data) {  
  // data {newUsername, newAvatar, newLanguage, newBirthday, }
  if(data.newUsername === "")  throw Error("ERROR! Username empty") 
  if(data.newAvatar === "")  {
    data.newAvatar = 'https://api.hoclieu.vn/images/game/bbfb3597f173af631cb24f6ee0f8b8da.png';
  }
  if(data.newLanguage === "")  {
    data.newLanguage = "vi";
  }
  if(data.newBirthday === "")  {
    data.newBirthday = new Date("2000-01-01"); // 01-01-2000
  } else {
    const [year, month, day] = data.newBirthday.split("/");      
    data.newBirthday = new Date(year, month, day);  // month = [0;11];
  }
  return data;
}

const User = mongoose.model('user', userSchema);

module.exports = User;