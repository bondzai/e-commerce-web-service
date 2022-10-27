const User = require('../model/user');
const BigPromise = require('../middleware/BigPromise');
const CustomError = require('../util/customError');
const cookieToken = require('../util/cookieToken');

exports.signup = BigPromise(async (req, res, next) => {
    const {name, email, password} = req.body;

    if (!email || !name || !password) {
        return next(new CustomError('name, email & password are required', 400));
    };

    const user = await User.create({
        name,
        email,
        password
    })

    cookieToken(user, res);
});