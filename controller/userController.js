const User = require('../model/user');
const BigPromise = require('../middleware/BigPromise');
const CustomError = require('../util/customError');
const cookieToken = require('../util/cookieToken');
const cloudinary = require('cloudinary');
const mailHelper = require('../util/emailHelper');
const crypto = require("crypto");

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

exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new CustomError("please provide email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(
            new CustomError("Email or password does not match or exist", 400)
        );
    }
    const isPasswordCorrect = await user.checkValidatedPassword(password);
    if (!isPasswordCorrect) {
        return next(
            new CustomError("Email or password does not match or exist", 400)
        );
    }
    cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        succes: true,
        message: "Logout success",
    });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new CustomError("Email not found as registered", 400));
    };
    const forgotToken = user.getForgotPasswordToken();
    await user.save({ validateBeforeSave: false });
    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`;
    const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;
    try {
        await mailHelper({
            email: user.email,
            subject: "JB eCommerce - Password reset email",
            message,
        });
        res.status(200).json({
        succes: true,
        message: "Email sent successfully",
        });
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new CustomError(error.message, 500));
    }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
    const token = req.params.token;
    const encryptedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        encryptedToken,
        forgotPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
        return next(new CustomError("Token is invalid or expired", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new CustomError("password and confirm password do not match", 400));
    }
    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    cookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

exports.changePassword = BigPromise(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");
    const checkOldPassword = await user.checkValidatedPassword(req.body.oldPassword);
    if (!checkOldPassword) {
        return next(new CustomError("old password is incorrect", 400));
    }
    user.password = req.body.password;
    await user.save();
    cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
    if (!req.body.name || !req.body.email) {
        return next(new CustomError("name and email are required", 400));
    }
    const newData = {
        name: req.body.name,
        email: req.body.email
    };
    if (req.files) {
        const user = await User.findById(req.user.id);
        const imageId = user.photo.id;
        const resp = await cloudinary.v2.uploader.destroy(imageId);
        const result = await cloudinary.v2.uploader.upload(
        req.files.photo.tempFilePath,
        {
            folder: "users",
            width: 150,
            crop: "scale",
        });
        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url,
        };
    }
    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});

exports.managerAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find({ role: "user" });
    res.status(200).json({
        success: true,
        users,
    });
});