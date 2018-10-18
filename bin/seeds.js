const mongoose = require('mongoose');
const User = require('../models/User');
mongoose.connect('mongodb/localhost:27017/lab-passport-roles',{useNewUrlParser: true})
const users = [{
    username: "El Boss",
    password: "123456",
    role: "Boss"
}];

User.create(users, () => {
    console.log(users);
    mongoose.connection.close();
});