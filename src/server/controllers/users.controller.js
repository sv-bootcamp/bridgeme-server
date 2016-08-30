'use strict';

const user = require('mongoose').model('user');

// Return all users. 
export function getAll(req, res, next) {
  user.find((err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
}

// Get all user list except logined user
export function getMentorList(req, res, next) {
  user.find({ 'email' : { $ne : 'session@yoda.com' }},  // if session_auth add, 'session' => req.session.email
    { email: 0, userId: 0, age: 0, region: 0, skills: 0, regDate: 0 }, (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    });
}  
