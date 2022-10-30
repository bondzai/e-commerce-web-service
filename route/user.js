const express = require('express');
const router = express.Router();

const {
    signup, 
    login, 
    logout, 
    forgotPassword, 
    passwordReset,
    getLoggedInUserDetails,
    changePassword,
    updateUserDetails,
    adminAllUser
} = require('../controller/userController');

const { isLoggedIn, customRole } = require('../middleware/user');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route('/userDashboard').get(isLoggedIn, getLoggedInUserDetails);
router.route('/password/update').post(isLoggedIn, changePassword);
router.route('/userdashboard/update').post(isLoggedIn, updateUserDetails);
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser);
module.exports = router;