const express = require('express');
const router = express.Router();

const {testproduct} = require('../controller/productController');

router.route('/testproduct').get(testproduct)

module.exports = router;