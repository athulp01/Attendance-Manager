var model = require('./schema')
var sessions = require('express-session')

exports.register = (req, res)=>{
    if(req.body.regno && req.body.uname && req.body.pass) {
        let userData = {
            reg_number : req.body.regno,
            username : req.body.uname,
            password : req.body.pass
        }

        model.user.create(userData, (err, usr)=> {
            if(err) {
                console.log(err)
                res.send("Problem with registration")
            }else {
                res.send("400")
            }
        })
    }
}

exports.addDetails = (req, res, next)=> {
    let id = req.session.userID
    console.log(id)
    console.log(req.body)
    if(typeof(id)== undefined) {
        res.redirect('/auth.html')
    }else {
        model.course.findById(id, (err, cour)=> {
            if(err) {
                console.log(err)
                res.sendStatus(500)
            }else {
                if(!cour) {
                    let courseData = {
                        Uid:        "dffdd",
                        courses:    [{
                            name:   req.body.name,
                            no_bunked:  Number(req.body.num)
                        }]
                    }
                    console.log(courseData)
                    model.course.findOne({Uid:"dffdd"}, (err, ret)=> {
                        if(!ret) {
                            model.course.create(courseData, (err, usr) => {
                                if(err) {
                                    console.log(err)
                                    res.send("Problem with registration")
                                }else {
                                    res.send("400")
                                }
                            })
                        }else {
                            console.log(res.course) 
                        }
                    })

                }
            }
        })
    }
}
exports.login = (req, res) => {
    console.log(req.body.regno)
    model.user.findOne({reg_number: req.body.regno}, (err, usr) => {
        console.log(usr)
        if(err) {
            console.log(err)
            res.send("error logging in!")
        }else if(!usr) {
            res.send("Unknown credentials")
        }else {
            req.session.userID = usr._id
            req.session.save()
            console.log(req.session.userID)
            console.log(usr._id)
            let courses = [
                {name: "Data structures and algorithms",
                num:   8},
                {name: "Electronics Circuits 2",
                num:   5},
                {name: "Economics",
                num:   10}
            ]
            console.log(usr)
            res.render('home', {user:usr.name, courses:courses})
        }
    })
}

exports.serveHome = (req, res) => {
    if(typeof(req.session.userID)== undefined) {
        res.redirect('/auth.html')
    }else {
        console.log(req.session.id)
        model.user.findById(req.session.id, (err, usr) => {
            console.log(typeof usr === 'undefined')
            if(typeof usr === 'undefined') {
                res.redirect('/auth.html')
            }else {
                let courses = [
                    {name: "Data structures and algorithms",
                    num:   8},
                    {name: "Electronics Circuits 2",
                    num:   5},
                    {name: "Economics",
                    num:   10}
                ]
                console.log(usr)
                res.render('home', {user:usr.name, courses:courses})
            }
        })
    } 
}

