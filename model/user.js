const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'required'],
        maxlength: [40, 'name should be under 40 characters']
    },
    email: {
        type: String,
        required: [true, 'required'],
        validate: [validator.isEmail, 'plase enter email in correct format'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'required'],
        minlength: [6, 'password should be atleast 6 characters'],
        select: false
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    };
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.checkValidatedPassword = async function(loginPassword) {
    return await bcrypt.compare(loginPassword, this.password);
};

userSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
};

userSchema.methods.getForgotPasswordToken = function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    return forgotToken;
  };
  
module.exports = mongoose.model('User', userSchema);