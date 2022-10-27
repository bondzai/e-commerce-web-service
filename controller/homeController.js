const BigPromise = require('../middleware/BigPromise');

exports.home = BigPromise(async (req, res) => {
    res.status(200).json({
        success: true,
        greeting: "hello from API"
    });
});