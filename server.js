var express = require("express")
var bodyParser = require('body-parser')
var authenication = require('./routes/authroutes')
var ejs = require('ejs')


var app = express()
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.set('view engine', 'ejs')


app.get('/home', (req, res)=>{
    let courses = [
        {name: "Data structures and algorithms",
         num:   8},
        {name: "Electronics Circuits 2",
         num:   5},
        {name: "Economics",
         num:   10}
    ]
    res.render('home', {user:"Athul", courses:courses})
})
app.post('/reg', authenication.register)

app.listen(process.env.PORT||5000)
