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

let login = function(req, res) {
  model.user.findOne({reg_number: req.body.regno}, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(401);
    } else {
      if (req.body.pass != result.password) {
        res.sendStatus(401);
      } else {
        req.session.userID = result._id;
        req.session.userName= result.username;
        req.session.regNo = result.reg_number;
        res.sendStatus(200);
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
    model.user.create(userData, (err, usr)=> {
      if (err) {
        console.error(err);
        res.sendStatus(409);
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
      console.error(err);
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
        model.course.findOne({Uid: id}, (err, ret)=> {
          if (ret != null) {
            ret.courses.push(courseData['courses']);
            ret.save();
            res.sendStatus(200);
          } else {
            model.course.create(courseData, (err, usr) => {
              if (err) {
                console.error(err);
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
  if (id == null) {
    res.redirect('../auth');
  } else {
    model.user.findById(id, (err, result) => {
      if (err) {
        console.error(err);
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
  if (req.session.userID == null) {
    res.redirect('../auth');
  } else {
    model.course.findOne({Uid: req.session.userID}, (err, Cresult) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else if (Cresult == null) {
        res.render('profile', {user: req.session.userName});
      } else {
        res.render('home', {user: req.session.userName, courses: Cresult.courses});
      }
    });
  }
};

let profile = function(req, res, next) {
  model.course.findOne({Uid: req.session.userID}, (err, Cresult) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (Cresult == null) {
      res.redirect('../auth');
    } else {
      res.render('profile', {user: req.session.userName, courses: Cresult.courses});
    }
  });
};

let bunk = function(req, res, next) {
  model.course.updateOne({'Uid': req.session.userID, 'courses.name': req.body.name},
                                  {$inc: {'courses.$.no_bunked': 1}, 
                                  $push: {'courses.$.date_bunked': new Date()}}, 
                                  (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(500);
    } else {
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
  model.course.updateOne({Uid: req.session.userID},
                {$pull: {courses: {name: req.body.name}}}, 
                (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
};

let removeDate = function(req, res) {
  var query = {}
  query["courses.$.date_bunked."+ req.body.idx] = 1

  model.course.updateOne({'Uid': req.session.userID, 'courses.name': req.body.name},
                         {$unset: query},
                         (err, result) => {
    if (err) {
      console.error(err)
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(500);
    }
  });
  
  model.course.updateOne({'Uid': req.session.userID, 'courses.name': req.body.name},
                        {$pull: {"courses.$.date_bunked":null}, $inc: {"courses.$.no_bunked": -1}},
                        (err, result) => {
  if (err) {
    console.error(err)
    res.sendStatus(500);
  } else if (result == null) {
    res.sendStatus(500);
  } else {
    res.sendStatus(200);
  }
});
};

let getReport = function(req, res) {
  model.course.findOne({Uid: req.session.userID}, (err, result) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else if (result == null) {
      res.sendStatus(500);
    } else {
      res.render('report', {user: req.session.userName, courses: result.courses});
    }
  });
};

let getDate = function(req, res) {
  model.course.findOne({Uid: req.session.userID, "courses.name" : req.params.name},
                {_id: 0, 'courses.$': 1},
                (err, result) => {
  if (err) {
    console.error(err);
    res.sendStatus(500);
  } else if (result == null) {
    res.sendStatus(500);
  } else {
    res.json(result)
  }
});
};

let authRoute = express.Router();
authRoute.use(checkForSession);   //acts as a middleware to authenicate the user for every requests in the /u/* route

app.use('/u', authRoute);

app.get('/', authRoute);

app.post('/login', login);
app.post('/register', register);


authRoute.get('/', home);
authRoute.get('/profile', profile);
authRoute.get('/logout', logout);
authRoute.get('/report', getReport);
authRoute.get('/getdate/:name', getDate);

authRoute.post('/addcourse', addcourse);
authRoute.post('/bunk', bunk);
authRoute.post('/removecourse', removeCourse);
authRoute.post('/removedate', removeDate);


app.listen(process.env.PORT||5000);
