const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');

const model = require('./schema');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname, {extensions: 'html'}));

app.use(session({ // cookie with key userID is used
  name: '_amanager',
  resave: true,
  saveUninitialized: true,
  secret: 'howdy!!!lal laa',
}));

app.set('view engine', 'ejs'); // templating engine

let course_data = [
  {name: 'Data structures and algorithms',
    num: 8},
  {name: 'Electronics Circuits 2',
    num: 5},
  {name: 'Economics',
    num: 10},
];

let login = function(req, res) {
  console.log(req.body.regno);
  model.user.findOne({reg_number: req.body.regno}, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(401);
    } else {
      console.log(req.body.pass, result.password);
      if (req.body.pass != result.password) {
        res.sendStatus(401);
      } else {
        req.session.userID = result._id;
        req.session.userName= result.username;
        req.session.regNo = result.reg_number;
        model.course.findOne({Uid: result._id}, (err, Cresult) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else if (Cresult == null) {
            res.render('profile', {user: result.username});
          } else {
            console.log(Cresult);
            res.render('home', {user: result.username, courses: Cresult.courses});
          }
        });
      }
    }
  });
};

let register = function(req, res, next) {
  if (req.body.regno && req.body.uname && req.body.pass) {
    const userData = {
      reg_number: req.body.regno,
      username: req.body.uname,
      password: req.body.pass[0],
    };
    console.log(userData);
    model.user.create(userData, (err, usr)=> {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    });
  } else {
    res.sendStatus(400);
  }
};

let addcourse = function(req, res, next) {
  const id = req.session.userID;
  model.user.findById(id, (err, result)=> { // TODO: Possibly redudant check
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      if (result == null ) {
        res.sendStatus(500);
      } else {
        const courseData = {
          Uid: id,
          courses: {
            name: req.body.name,
            no_bunked: Number(req.body.num),
          }};
        console.log(courseData);
        model.course.findOne({Uid: id}, (err, ret)=> {
          if (ret != null) {
            console.log(ret['courses']); // TODO: append to courses array
            ret.courses.push(courseData['courses']);
            ret.save();
            res.sendStatus(200);
          } else {
            model.course.create(courseData, (err, usr) => {
              if (err) {
                console.log(err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          }
        });
      }
    }
  });
};

let checkForSession = function(req, res, next) {
  const id = req.session.userID;
  console.log(id);
  if (id == null) {
    res.redirect('../auth');
  } else {
    model.user.findById(id, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else if (result == null) {
        res.redirect('../auth');
      } else {
        next();
      }
    });
  }
};

let home = function(req, res, next) {
  console.log(req.session.userID);
  if (req.session.userID == null) {
    res.redirect('../auth');
  } else {
    model.course.findOne({Uid: req.session.userID}, (err, Cresult) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else if (Cresult == null) {
        res.render('profile', {user: req.session.userName});
      } else {
        console.log(Cresult);
        res.render('home', {user: req.session.userName, courses: Cresult.courses});
      }
    });
  }
};

let profile = function(req, res, next) {
  model.course.findOne({Uid: req.session.userID}, (err, Cresult) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (Cresult == null) {
      res.redirect('../auth');
    } else {
      console.log(Cresult);
      res.render('profile', {user: req.session.userName, courses: Cresult.courses});
    }
  });
};

let bunk = function(req, res, next) {
  console.log(req.session.userID);
  console.log(req.body.name);
  model.course.updateOne({'Uid': req.session.userID, 'courses.name': req.body.name}, {$inc: {'courses.$.no_bunked': 1}, $push: {'courses.$.date_bunked': new Date()}}, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.sendStatus(200);
    }
  });
};

let logout = function(req, res) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
};

let removeCourse = function(req, res) {
  console.log(req.body);
  model.course.updateOne({Uid: req.session.userID}, {$pull: {courses: {name: req.body.name}}}, (err, result) => {
    console.log(result);
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.sendStatus(200);
    }
  });
};

let editCourse = function(req, res) {
  console.log(req.body);
  model.course.updateOne({'Uid': req.session.userID, 'courses.name': req.body.name}, {$set: {'courses.$.no_bunked': req.body.num}}, (err, result) => {
    console.log(result);
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.sendStatus(200);
    }
  });
};

let getReport = function(req, res) {
  model.course.findOne({Uid: req.session.userID}, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(500);
    } else {
      console.log(result);
      res.render('report', {user: req.session.userName, courses: result.courses});
    }
  });
};
let authRoute = express.Router();
authRoute.use(checkForSession);

app.use('/u', authRoute);

app.get('/', authRoute);

app.post('/login', login);
app.post('/register', register);


authRoute.get('/', home);
authRoute.post('/addcourse', addcourse);
authRoute.get('/profile', profile);
authRoute.post('/bunk', bunk);
authRoute.get('/logout', logout);
authRoute.post('/removecourse', removeCourse);
authRoute.post('/editcourse', editCourse);
authRoute.get('/report', getReport);

app.get('/getCookie', (req, res) => {
  res.send(req.session.userID);
});

app.listen(process.env.PORT||5000);
