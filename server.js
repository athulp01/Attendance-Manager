var express = require("express")
var bodyParser = require('body-parser')
var path = require('path')
var authenication = require('./routes/authroutes')

var app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post('/reg', authenication.register)

app.listen(process.env.PORT)
