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

// Get all user list except logged in user
export function getMentorList(req, res, next) {
  // TODO: Once session_auth is implemented, replace the email address with req.session.email.
  user.find({ 'email' : { $ne : 'session@yoda.com' }},
    // TODO: Longer term, we should migrate to a UserSummary object
    // that contains subset of fields. For now, we return only the following
    // fields from user object:
    //
    // - userId
    // - name
    // - field
    { userId: 1, email: 0, name: 1, age: 0, field: 1, region: 0, skills: 0, regDate: 0 }, (err, doc) => {
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    });
}  
