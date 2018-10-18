const express = require('express');
const router  = express.Router();
const User = require('../models/User');
const Course = require('../models/Course')

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

function checkRole(role){
  return function (req, res, next){
    if(req.isAuthenticated() && req.user.role === role) return next();
    res. redirect('/private');
  }
}


const checkBoss = checkRole('Boss');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user: req.user});
});


router.get('/private', isLoggedIn, (req, res) => {
  User.find({_id: {$ne: req.user.id}})
  .then(users => {
    Course
        .find()
        .then( courses => {
          if (req.user.role === `TA`) return res.render(`private-users`, {users, courses, user: req.user, ta:true});
          res.render(`private-users`, {users, courses, user: req.user})
        })
  })
 
});

router.get('/boss', checkBoss, (req, res) => {
  User
  .find({role: {$ne: 'Boss' }})
  .then(users => {
    res.render('boss',{users:users, user: req.user})
  })
  // res.render('boss', {user: req.user})
});

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/user/create',(req,res)=>{
  const {name,description} = req.body;
  const newCourse = new Course({name, description})
  newCourse.save()
        .then(course => {
          res.redirect('/private')
        })
})

router.get(`/boss/delete/:id`, (req,res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(() => res.redirect(`/boss`))
  ;
});

module.exports = router;
