require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoccumaent = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoccumaent));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);
app.set('view engine', 'ejs');
app.use(morgan('tiny'));

const home = require('./route/home');
const user = require('./route/user');
const product = require('./route/product');

app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1', product);

app.get('/signuptest',(req, res) =>{
    res.render('signuptest');
}) 

module.exports = app;