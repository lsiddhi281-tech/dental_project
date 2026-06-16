var express = require('express');
var query1 = require('../db.js');

var routers = express.Router();


routers.get('/',async(req,res)=>{
    var sql = 'select * from blog';
    var blog = await query1(sql);
    var sql1 = 'select * from faqs';
    var faqs = await query1(sql1);
     var sql2 = 'select * from testimonial';
    var testimonial = await query1(sql2);
    var sql3 = 'select * from services';
    var services = await query1(sql3);
    res.render("web/index.ejs",{blog:blog,faqs:faqs,testimonial:testimonial,services:services});
})

routers.post('/appointment_save',async(req,res)=>{
    var {name,email,sid,adate} = req.body;
    var sql = 'insert into appointment (name,email,sid,adate)value(?,?,?,?)';
    var data = await query1(sql,[name,email,sid,adate]);
    res.redirect("/");
})

routers.get('/Whyus',(req,res)=>{
    res.render("web/Whyus.ejs");
})

routers.get('/service',async(req,res)=>{
    var sql = 'select * from services';
    var services = await query1(sql);
    res.render("web/service.ejs",{services:services});
})

routers.get('/team',async(req,res)=>{
    var sql = 'select * from doctors';
    var doctors = await query1(sql);
    var sql2 = 'select * from whyTeam';
    var whyTeam = await query1(sql2);
    res.render("web/team.ejs",{doctors:doctors,whyTeam:whyTeam});
})

routers.get('/Pricing',(req,res)=>{
    res.render("web/Pricing.ejs");
})

routers.get('/DentalSolutions',async(req,res)=>{
    var sql = 'select * from DentalSolutions';
    var data = await query1(sql);
    res.render("web/DentalSolutions.ejs",{data:data});
})

module.exports = routers;
