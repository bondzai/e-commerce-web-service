const BigPromise = require('../middleware/BigPromise');

exports.testproduct = BigPromise(async (req, res) => {
    res.status(200).json({
        success: true,
        greeting: "hello from product route"
    });
});

exports.addProduct = BigPromise(async (req, res, next) => {
    let imageArray = [];
    if (!req.files) {
        return next(new CustomError("images are required", 401));
    }
    console.log("RESULT", req.files.photos[0]);
    if (req.files) {
        for (let index = 0; index < req.files.photos.length; index++) {
            console.log("UPLOAD START...");
            let result = await cloudinary.v2.uploader.upload(
                req.files.photos[index].tempFilePath,
                {
                    folder: "products",
                });
            console.log("RESULT", result);
            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url,
            });
        }
    }
    req.body.photos = imageArray;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).json({
      success: true,
      product,
    });
});