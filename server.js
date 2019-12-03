var express = require("express")
var bodyParser = require('body-parser')
var ejs = require('ejs')
var session = require("express-session")

var model = require('./schema')

var app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(__dirname))

app.use(session({               //cookie with key userID is used
    name: '_amanager',
    resave: true,
    saveUninitialized: true,
    secret:"howdy!!!lal laa"
}))

app.set('view engine', 'ejs') //templating engine

var course_data = [
    {name: "Data structures and algorithms",
    num:   8},
    {name: "Electronics Circuits 2",
    num:   5},
    {name: "Economics",
    num:   10}
]

var login = function(req, res) {
    console.log(req.body.regno)
    model.user.findOne({reg_number: req.body.regno}, (err, result) => {
        console.log(result)
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }else if(result == null) {
            res.sendStatus(401)
        }else {
                req.session.userID = result._id
                req.session.userName= result.username
                req.session.regNo = result.reg_number
                model.course.findOne({Uid: result._id}, (err, Cresult) => {
                if(err) {
                    console.log(err)
                    res.sendStatus(500)
                }else if(Cresult == null) {
                    res.render('profile', {user:result.username})
                }else {
                    console.log(Cresult)
                    res.render('home', {user:result.username, courses:Cresult.courses})
                }
            })
        }
    })
}

var register = function(req, res, next) {
    if(req.body.regno && req.body.uname && req.body.pass) {
        let userData = {
            reg_number : req.body.regno,
            username : req.body.uname,
            password : req.body.pass
        }

        model.user.create(userData, (err, usr)=> {
            if(err) {
                console.log(err)
                res.sendStatus(500)
            }else {
                res.sendStatus(201)
            }
        })
    }else {
        res.sendStatus(400)
    }
}

var addcourse = function(req, res, next) {
    let id = req.session.userID
    model.user.findById(id, (err, result)=> {   //TODO: Possibly redudant check
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }else {
            if(result == null ) {
                res.sendStatus(500)
            }else {
                let courseData = {
                    Uid     :    id,
                    courses :    {
                        name        :  req.body.name,
                        no_bunked   :  Number(req.body.num)
                    }}
                console.log(courseData)
                model.course.findOne({Uid:id}, (err, ret)=> {
                    if(ret != null) {
                        console.log(ret['courses'])         //TODO: append to courses array
                        ret.courses.push(courseData['courses'])
                        ret.save()
                    } else {
                        model.course.create(courseData, (err, usr) => {
                            if(err) {
                                console.log(err)
                                res.sendStatus(500)
                            }else {
                                res.sendStatus(201)
                            }
                        })
                    }
                })
            }
        }
    })
}

var checkForSession = function(req, res, next) {
    let id = req.session.userID
    console.log(id)
    if(id == null) {
        res.redirect('../auth.html')
    }else {
        model.user.findById(id, (err, result) => {
            if(err) {
                console.log(err)
                res.sendStatus(500)
            }else if(result == null) {
                res.redirect('../auth.html')
            }else {
                next()
            }
        })
    }
}

var home = function(req, res, next) {
    console.log(req.session.userID)
    if(req.session.userID == null) {
        res.redirect('../auth.html')
        }else {
            model.course.findOne({Uid: req.session.userID}, (err, Cresult) => {
                if(err) {
                    console.log(err)
                    res.sendStatus(500)
                }else if(Cresult == null) {
                    res.redirect('../auth.html')
                }else {
                    console.log(Cresult)
                    res.render('home', {user:req.session.userName, courses:Cresult.courses})
                }
            })
            
        }
}

var profile = function(req, res, next) {
    model.course.findOne({Uid: req.session.userID}, (err, Cresult) => {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }else if(Cresult == null) {
            res.redirect('../auth.html')
        }else {
            console.log(Cresult)
            res.render('profile', {user:req.session.userName, courses:Cresult.courses})
        }
    })
}

var bunk = function(req, res, next) {
    console.log(req.session.userID)
    console.log(req.body.name)
    model.course.updateOne({Uid:req.session.userID, "courses.name":req.body.name}, {$inc:{"courses.$.no_bunked":1}}, (err, result) => {
        console.log(result)
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }else if(result == null) {
            res.sendStatus(500)
        }else {
            console.log(result)
            res.sendStatus(200)
        }
    })
}

var logout = function(req, res) {
    if (req.session) {
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/')
          }
        })
      }
}

var authRoute = express.Router()
authRoute.use(checkForSession)

app.use('/u', authRoute)

app.get('/', authRoute)

app.post('/login', login)
app.post('/register', register)


authRoute.get('/', home)
authRoute.post('/addcourse', addcourse)
authRoute.get('/profile', profile)
authRoute.post('/bunk', bunk)
authRoute.get('/logout', logout)

app.get('/getCookie', (req,res) => {
    res.send(req.session.userID)
})

app.listen(process.env.PORT||5000)
