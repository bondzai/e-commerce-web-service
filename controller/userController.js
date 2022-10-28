const User = require('../model/user');
const BigPromise = require('../middleware/BigPromise');
const CustomError = require('../util/customError');
const cookieToken = require('../util/cookieToken');
const cloudinary = require('cloudinary');

exports.signup = BigPromise(async (req, res, next) => {
    if (!req.files) {
        return next (new CustomError('pho to is required to signup',400));
    }
    const {name, email, password} = req.body;
    if (!email || !name || !password) {
        return next(new CustomError('name, email & password are required', 400));
    };
    let file = req.files.photo;
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale"
    });
    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    })
    cookieToken(user, res);
});