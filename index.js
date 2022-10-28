const app = require('./app');
const connectDatabase = require('./config/database');
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
connectDatabase();

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: ${process.env.PORT}`)
})