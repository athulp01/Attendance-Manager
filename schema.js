var mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://athul:${process.env.db_pass}@cluster0-k1eqt.azure.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

var userSchema = new mongoose.Schema({
    reg_number: {
        type:   String,
        unique: true,
        required:true
    },
    username: {
        type:   String,
        unique: false,
        required: true
    },
    password: {
        type:   String,
        required: true
    }
})

var courseSchema = new mongoose.Schema({
    Uid : {
        type: String,
        required: true,
        unique: true
    },
    courses: [{
        name: {
            type: String,
        },
        no_bunked: {
            type: Number,
        }
    }]
})

exports.user = mongoose.model('user', userSchema)
exports.course = mongoose.model('course', courseSchema)
