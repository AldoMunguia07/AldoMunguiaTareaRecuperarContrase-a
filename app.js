var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const corsWhiteList = (process.env.CORSLIST || '[]').split('|');
const corsOptions = {
    origin: (origin, next) =>{
        console.log('CORS origin: ', origin);
        if(corsWhiteList.includes(origin)){
            next(null, true);
        } else {
            next(new Error('No Allowed by Cors Policy'));
        }
    }
}

var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);


module.exports = app;
