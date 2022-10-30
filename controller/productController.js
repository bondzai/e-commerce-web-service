const BigPromise = require('../middleware/BigPromise');

exports.testproduct = BigPromise(async (req, res) => {
    res.status(200).json({
        success: true,
        greeting: "hello from product route"
    });
});