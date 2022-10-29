const User = require("../model/user");
const BigPromise = require("../middleware/BigPromise");
const CustomError = require("../util/customError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
    let token = req.cookies.token;
    if (!token && req.header("Authorization")) {
        token = req.header("Authorization").replace("Bearer ", "");
    }
    if (!token) {
        return next(new CustomError("Login first to access this page", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
});