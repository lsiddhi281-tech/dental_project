var express = require('express');
var app = express();
var fileupload=require('express-fileupload');
var fs = require('fs');
var path = require('path');
var session = require('express-session');

var web = require('./routes/web.js');
var admin = require('./routes/admin.js');

// middle ware
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(fileupload());
app.use(session({
    secret:"dentalkey",
    resave:false,
    saveUninitialized:true
}))

// routes 
app.use('/',web);
app.use('/admin',admin);

app.listen(3000);