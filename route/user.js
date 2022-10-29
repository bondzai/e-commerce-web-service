const express = require('express');
const router = express.Router();

const {
    signup, 
    login, 
    logout, 
    forgotPassword, 
    passwordReset,
    getLoggedInUserDetails,
    changePassword
} = require('../controller/userController');

const { isLoggedIn } = require('../middleware/user');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route('/userDashboard').get(isLoggedIn, getLoggedInUserDetails);
router.route('/password/update').post(isLoggedIn, changePassword);

module.exports = router;