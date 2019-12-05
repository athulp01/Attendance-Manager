const mongoose = require('mongoose');

serverURL = `mongodb+srv://athul:${process.env.db_pass}@cluster0-k1eqt.azure.mongodb.net/amanager?retryWrites=true&w=majority`;
localURL = 'mongodb://localhost/amanager';

mongoose.connect(serverURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  reg_number: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: false,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const courseSchema = new mongoose.Schema({
  Uid: {
    type: String,
    required: true,
    unique: true,
  },
  courses: [{
    name: {
      type: String,
    },
    no_bunked: {
      type: Number,
    },
    date_bunked: [{
      type: Date,
    }],
  }],
});

exports.user = mongoose.model('user', userSchema);
exports.course = mongoose.model('course', courseSchema);
