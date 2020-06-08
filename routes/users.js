const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
// User model
const User = require('../models/User');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const student_controller = require("../controllers/student.controller");


//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

router.get('/offers', forwardAuthenticated, (req, res) => res.render('comments'));
router.get('/detail', forwardAuthenticated, (req, res) => res.render('post-detail'));
router.get('/dishes', forwardAuthenticated, (req, res) => res.render('Dishes'));

router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard'));

router.get('/contact', forwardAuthenticated, student_controller.contact);

router.post('/contact', student_controller.contactUser);

// Register
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/dashboard');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });
  
  // Login
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  });

module.exports = router;
