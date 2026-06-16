var express = require('express');
var fs = require('fs');
var path = require('path');
var routers = express.Router();
var query1 = require('../db.js');


routers.get('/',(req,res)=>{
    res.redirect('/admin/login');
})
routers.get('/login',async(req,res)=>{
    res.render("admin/login.ejs");
    // var sql ='select * from login';
    // var data = await query1(sql);
    // res.send(data)

})
routers.post('/login_check',async(req,res)=>{
    // res.send(req.body);
    var {username,password} = req.body;
    var sql = 'select * from login where username = ? and password = ?';
    var data = await query1(sql,[username,password]);
    if(data[0]){
        req.session.lid=data[0].lid;
        req.session.admin_name=data[0].admin_name;
        res.redirect('/admin/index');
    }else{
        res.redirect('/admin/login');
    }
})
routers.use((req,res,next)=>{
    res.locals.session=req.session;
    next();
})
routers.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/admin/login');
})
routers.get('/forgot',(req,res)=>{
    res.render("admin/forgot-password.ejs");
})
routers.get('/index',(req,res)=>{
    res.render("admin/index.ejs",{admin_name: req.session.admin_name});
})
// ----------------DentalSolutions------------
routers.get('/DentalSolutions',async(req,res)=>{
    var sql = 'select * from DentalSolutions';
    var data = await query1(sql);
    res.render("admin/DentalSolutions.ejs",{data:data});
})
routers.post('/DentalSolutions_save',async(req,res)=>{
    // res.send(req.body)
    var{title,descrp} = req.body;
    var sql = 'insert into DentalSolutions (title,descrp)value(?,?)';
    var data = await query1(sql,[title,descrp]);
    res.redirect("/admin/DentalSolutions");
})
routers.get('/DentalSolutions_delete/:id',async(req,res)=>{
    var id = req.params.id;
    // res.send(id);
    var sql = 'delete from DentalSolutions where ds_id = ?';
    var data = await query1(sql,[id]);
    res.redirect('/admin/DentalSolutions');
})
routers.get('/DentalSolutions_edit/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'select * from DentalSolutions where ds_id=?';
    var data = await query1(sql,[id]);
    res.render('admin/DentalSolutions_update.ejs',{data:data[0]});
})
routers.post('/DentalSolutions_update_save/:id',async(req,res)=>{
    var id = req.params.id;
    var {title,descrp}=req.body;
    var sql='update DentalSolutions set title=?,descrp=? where ds_id=?';
    var data = await query1(sql,[title,descrp,id]);
    res.redirect('/admin/DentalSolutions');
})
// ----------------Blog------------
routers.get('/blog',async(req,res)=>{
    var sql = 'select * from blog';
    var data = await query1(sql);
    res.render("admin/blog.ejs",{data:data});
})
routers.post('/blog_save',async(req,res)=>{
    var{bphoto,btitle,bdate,descrp} = req.body;
    var imgname = Date.now()+req.files.bphoto.name;
    var uploadpath=path.join(__dirname,'../','public',imgname);
    req.files.bphoto.mv(uploadpath,(err)=>{});
    var sql = 'insert into blog (btitle,bphoto,bdate,descrp)value(?,?,?,?)';
    var data = await query1(sql,[btitle,imgname,bdate,descrp]);
    res.redirect("/admin/blog");
})
routers.get('/blog_delete/:id/:img1',async(req,res)=>{
    var id = req.params.id;
    var img = req.params.img1;
    var imgpath = path.join(__dirname,'../','public',img);
    fs.unlink(imgpath,async(err)=>{
        var sql = 'delete from blog where bid = ?';
        var data = await query1(sql,[id]);
        res.redirect('/admin/blog');
    })
    
})
routers.get('/blog_edit/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'select * from blog where bid=?';
    var data = await query1(sql,[id]);
    res.render('admin/blog_update.ejs',{data:data[0]});
})
routers.post('/blog_update_save/:id',async(req,res)=>{
    var id = req.params.id;
    var {btitle,new_bphoto,old_bphoto,bdate,descrp}=req.body;
    if(req.files){
        // new
        var imgname = Date.now()+req.files.new_bphoto.name;
        var uploadpath=path.join(__dirname,'../','public',imgname);
        req.files.new_bphoto.mv(uploadpath,(err)=>{});
        // old
        var imgpath = path.join(__dirname,'../','public',old_bphoto);
        fs.unlink(imgpath,(err)=>{})
    }else{
        var imgname = old_bphoto;
    }
    var sql='update blog set btitle=?,bphoto=?,bdate=?,descrp=? where bid=?';
    var data = await query1(sql,[btitle,imgname,bdate,descrp,id]);
    res.redirect('/admin/blog');
})
// ----------------FAQ'S------------
routers.get('/faqs',async(req,res)=>{
    var sql = 'select * from faqs';
    var data = await query1(sql);
    res.render("admin/faqs.ejs",{data:data});
})
routers.post('/faqs_save',async(req,res)=>{
    // res.send(req.body)
    var{question,answer} = req.body;
    var sql = 'insert into faqs (question,answer)value(?,?)';
    var data = await query1(sql,[question,answer]);
    res.redirect("/admin/faqs");
})
routers.get('/faqs_delete/:id',async(req,res)=>{
    var id = req.params.id;
    // res.send(id);
    var sql = 'delete from faqs where fid = ?';
    var data = await query1(sql,[id]);
    res.redirect('/admin/faqs');
})
routers.get('/faqs_edit/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'select * from faqs where fid=?';
    var data = await query1(sql,[id]);
    res.render('admin/faqs_update.ejs',{data:data[0]});
})
routers.post('/faqs_update_save/:id',async(req,res)=>{
    var id = req.params.id;
    var {question,answer}=req.body;
    var sql='update faqs set question=?,answer=? where fid=?';
    var data = await query1(sql,[question,answer,id]);
    res.redirect('/admin/faqs');
})
// ----------------Our Services------------
routers.get('/services',async(req,res)=>{
    var sql = 'select * from services';
    var data = await query1(sql);
    res.render("admin/services.ejs",{data:data});
})
routers.post('/services_save',async(req,res)=>{
    // res.send(req.body)
    var{title,descrp} = req.body;
    var sql = 'insert into services (title,descrp)value(?,?)';
    var data = await query1(sql,[title,descrp]);
    res.redirect("/admin/services");
})
routers.get('/services_delete/:id',async(req,res)=>{
    var id = req.params.id;
    // res.send(id);
    var sql = 'delete from services where sid = ?';
    var data = await query1(sql,[id]);
    res.redirect('/admin/services');
})
routers.get('/services_edit/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'select * from services where sid=?';
    var data = await query1(sql,[id]);
    res.render('admin/services_update.ejs',{data:data[0]});
})
routers.post('/services_update_save/:id',async(req,res)=>{
    var id = req.params.id;
    var {title,descrp}=req.body;
    var sql='update services set title=?,descrp=? where sid=?';
    var data = await query1(sql,[title,descrp,id]);
    res.redirect('/admin/services');
})
// ----------------Our Medical Team------------
routers.get('/doctors',async(req,res)=>{
    var sql = 'select * from doctors';
    var data = await query1(sql);
    res.render("admin/doctors.ejs",{data:data});
})
routers.post('/doctors_save',async(req,res)=>{
    var{dr_photo,dr_name,speciality} = req.body;
    var imgname = Date.now()+req.files.dr_photo.name;
    var uploadpath=path.join(__dirname,'../','public',imgname);
    req.files.dr_photo.mv(uploadpath,(err)=>{});
    var sql = 'insert into doctors (dr_name,dr_photo,speciality)value(?,?,?)';
    var data = await query1(sql,[dr_name,imgname,speciality]);
    res.redirect("/admin/doctors");
})
routers.get('/doctors_delete/:id/:img1',async(req,res)=>{
    var id = req.params.id;
    var img = req.params.img1;
    var imgpath = path.join(__dirname,'../','public',img);
    fs.unlink(imgpath,async(err)=>{
        var sql = 'delete from doctors where dr_id = ?';
        var data = await query1(sql,[id]);
        res.redirect('/admin/doctors');
    })
})
routers.get('/doctors_edit/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'select * from doctors where dr_id=?';
    var data = await query1(sql,[id]);
    res.render('admin/doctors_update.ejs',{data:data[0]});
})
routers.post('/doctors_update_save/:id',async(req,res)=>{
    var id = req.params.id;
    var {dr_name,new_dr_photo,old_dr_photo,speciality}=req.body;
    if(req.files){
        // new
        var imgname = Date.now()+req.files.new_dr_photo.name;
        var uploadpath=path.join(__dirname,'../','public',imgname);
        req.files.new_dr_photo.mv(uploadpath,(err)=>{});
        // old
        var imgpath = path.join(__dirname,'../','public',old_dr_photo);
        fs.unlink(imgpath,(err)=>{})
    }else{
        var imgname = old_dr_photo;
    }
    var sql='update doctors set dr_name=?,dr_photo=?,speciality=? where dr_id=?';
    var data = await query1(sql,[dr_name,imgname,speciality,id]);
    res.redirect('/admin/doctors');
})
// ----------------Why Our Team?------------
routers.get('/whyTeam',async(req,res)=>{
    var sql = 'select * from whyTeam';
    var data = await query1(sql);
    res.render("admin/whyTeam.ejs",{data:data});
})
routers.post('/whyTeam_save',async(req,res)=>{
    // res.send(req.body)
    var{title,descrp} = req.body;
    var sql = 'insert into whyTeam (title,descrp)value(?,?)';
    var data = await query1(sql,[title,descrp]);
    res.redirect("/admin/whyTeam");
})
routers.get('/whyTeam_delete/:id',async(req,res)=>{
    var id = req.params.id;
    // res.send(id);
    var sql = 'delete from whyTeam where tid = ?';
    var data = await query1(sql,[id]);
    res.redirect('/admin/whyTeam');
})
routers.get('/whyTeam_edit/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'select * from whyTeam where tid=?';
    var data = await query1(sql,[id]);
    res.render('admin/whyTeam_update.ejs',{data:data[0]});
})
routers.post('/whyTeam_update_save/:id',async(req,res)=>{
    var id = req.params.id;
    var {title,descrp}=req.body;
    var sql='update whyTeam set title=?,descrp=? where tid=?';
    var data = await query1(sql,[title,descrp,id]);
    res.redirect('/admin/whyTeam');
})
// ----------------Testimonial------------
routers.get('/testimonial',async(req,res)=>{
    var sql = 'select * from testimonial';
    var data = await query1(sql);
    res.render("admin/testimonial.ejs",{data:data});
})
routers.post('/testimonial_save',async(req,res)=>{
    var{tphoto,name,profession,msg} = req.body;
    var imgname = Date.now()+req.files.tphoto.name;
    var uploadpath=path.join(__dirname,'../','public',imgname);
    req.files.tphoto.mv(uploadpath,(err)=>{});
    var sql = 'insert into testimonial (name,tphoto,profession,msg)value(?,?,?,?)';
    var data = await query1(sql,[name,imgname,profession,msg]);
    res.redirect("/admin/testimonial");
})
routers.get('/testimonial_delete/:id/:img1',async(req,res)=>{
    var id = req.params.id;
    var img = req.params.img1;
    var imgpath = path.join(__dirname,'../','public',img);
    fs.unlink(imgpath,async(err)=>{
        var sql = 'delete from testimonial where tid = ?';
        var data = await query1(sql,[id]);
        res.redirect('/admin/testimonial');
    })
})
routers.get('/testimonial_edit/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'select * from testimonial where tid=?';
    var data = await query1(sql,[id]);
    res.render('admin/testimonial_update.ejs',{data:data[0]});
})
routers.post('/testimonial_update_save/:id',async(req,res)=>{
    var id = req.params.id;
    var {name,new_tphoto,old_tphoto,profession,msg}=req.body;
    if(req.files){
        // new
        var imgname = Date.now()+req.files.new_tphoto.name;
        var uploadpath=path.join(__dirname,'../','public',imgname);
        req.files.new_tphoto.mv(uploadpath,(err)=>{});
        // old
        var imgpath = path.join(__dirname,'../','public',old_tphoto);
        fs.unlink(imgpath,(err)=>{})
    }else{
        var imgname = old_tphoto;
    }
    var sql='update testimonial set name=?,tphoto=?,profession=?,msg=? where tid=?';
    var data = await query1(sql,[name,imgname,profession,msg,id]);
    res.redirect('/admin/testimonial');
})
// ----------------appointment------------
routers.get('/appointment',async(req,res)=>{
    // var sql = 'select * from appointment where status=?';
    var sql = 'Select * from appointment LEFT JOIN services on appointment.sid=services.sid where appointment.status=?';
    var data = await query1(sql,['pending']);
    var sql1 = 'select * from services';
    var service = await query1(sql1);
    res.render("admin/appointment.ejs",{service:service,data:data});
})
routers.get('/ap_confirm/:id',async(req,res)=>{
    var id = req.params.id;
    var sql='update appointment set status=? where aid=?';
    var data = await query1(sql,['confirm',id]);
    res.redirect('/admin/appointment');
})
routers.get('/ap_rejected/:id',async(req,res)=>{
    var id = req.params.id;
    var sql='update appointment set status=? where aid=?';
    var data = await query1(sql,['reject',id]);
    res.redirect('/admin/appointment');
})
routers.get('/ap_rejected_delete/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'delete from appointment where aid = ?';
    var data = await query1(sql,[id]);
    res.redirect('/admin/appointment_rejected');
})
routers.get('/ap_confirm_delete/:id',async(req,res)=>{
    var id = req.params.id;
    var sql = 'delete from appointment where aid = ?';
    var data = await query1(sql,[id]);
    res.redirect('/admin/appointment_confirm');
})
routers.get('/appointment_confirm',async(req,res)=>{
    var sql = 'Select * from appointment LEFT JOIN services on appointment.sid=services.sid where appointment.status=?';
    var data = await query1(sql,['confirm']);
    res.render("admin/appointment_confirm",{data:data});
})
routers.get('/appointment_rejected',async(req,res)=>{
    var sql = 'Select * from appointment LEFT JOIN services on appointment.sid=services.sid where appointment.status=?';
    var data = await query1(sql,['reject']);
    res.render("admin/appointment_rejected.ejs",{data:data});
})
// routers.get('/ap_search',async(req,res)=>{
//     var sql1 = 'select * from services';
//     var service = await query1(sql1);
//     // res.send(req.query);
//     var from_date = req.query.from_date;
//     var to_date = req.query.to_date;
//     var status = req.query.status;
//     var service1 = req.query.service1;
//     var sql = 'select * from appointment where (adate>=? and adate<=?) and status=? and sid=?';
//     var data = await query1(sql,[from_date,to_date,status,service1]);
//     res.send(data)
//     // res.render("admin/appointment",{service:service,data:data});
// })
routers.get('/ap_search', async(req,res)=>{

    var sql1 = 'select * from services';
    var service = await query1(sql1);

    var {from_date,to_date,status,service1} = req.query;

    var sql = 'select * from appointment where 1=1';
    var params = [];

    if(from_date && to_date){
        sql += ' and adate >= ? and adate <= ?';
        params.push(from_date,to_date);
    }

    if(status){
        sql += ' and status = ?';
        params.push(status);
    }

    if(service1){
        sql += ' and sid = ?';
        params.push(service1);
    }

    var data = await query1(sql,params);

    res.render("admin/appointment",{
        service:service,
        data:data
    });
});
module.exports=routers;