var mysql = require('mysql')
var conn = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'root',
    database: 'auth'  
})

conn.connect((err)=> {
    if(!err) {
        console.log("DB connected succesfully")
    }else {
        console.log("Problem connecting to DB")
    }
})

exports.register = (req, res) => {
    console.log(req.body)
    var qry = `insert into users values ('${req.body.regno}', '${req.body.uname}', '${req.body.pass}');`
    console.log(qry)
    conn.query(qry, (error, result , fields) => {
        if(error) {
            console.log("error", error)
            res.send({
                "code":400
            })
        } else {
            res.send({
                "code":200
            })
        }
    })
}