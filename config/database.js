const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`database connected successfully`))
    .catch((error) => {
      console.log(`database connection failed`);
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectDatabase;
