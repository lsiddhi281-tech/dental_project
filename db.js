var mysql = require('mysql2');
var util = require('util');

var conn = mysql.createConnection({
    host:'bdrmjqabafasj7rlnpa0-mysql.services.clever-cloud.com',
    user:'urbxtuqvs76ix1ds',
    password:'Xs1LMo0VIpr6hCLjtlxh',
    database:'bdrmjqabafasj7rlnpa0'
})

var exe = util.promisify(conn.query).bind(conn);
module.exports=exe;
