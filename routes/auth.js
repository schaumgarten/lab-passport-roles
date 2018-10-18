const express = require('express');
const authRouter = express.Router();
const User = require('../models/User')
const passport = require('passport');


authRouter.get('/auth/login', (req,res) => {
  console.log('estamos buscandote')
  res.render('login');
});


authRouter.get('/auth/register',(req,res) => {
  res.render('register')
  .catch ((err) =>{
    console.log(err)
  })
});

authRouter.post('/auth/register', (req, res) => {
  if(req.body.password !== req.body.confirmpassword) return res.render('login', {err: "Las constraseñas no coinciden"})
  // res.json(req.body);
  const {username, password} = req.body;
  User.register({username}, password)
    .then(user => {
      res.redirect('login');
    })
});

authRouter.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

authRouter.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/private"
}));


authRouter.post(`/auth/create`, (req,res) => {
  const {username, role, password} = req.body;
  User.register({username, role}, password)
    .then(() => res.redirect(`/boss`))
  ;
});


authRouter.post('/auth/login', passport.authenticate('local'),(req, res) => {
  res.redirect('/boss');
});

authRouter.post('/auth/logout', (req,res) => {
  req.logout();
  res.redirect("/auth/login");
});

authRouter.post('/auth/update',(req,res) => {
  const {username, password, role} = req.body;
  User.update({_id: req.user.id},{$set:{username,password,role}},{new:true})
    .then((user)=>{
      res.redirect('/private')
    })
})

module.exports = authRouter;