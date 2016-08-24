'use strict';

const matchSchema = require('mongoose').model('match');

// The mentee sent request to Mentor
export function requestMentoring(req, res, next) {
  let matchData = new matchSchema();
  matchData.mentor = 'mentor@gmail.com';
  matchData.mentee = 'mentee@gmail.com';

  matchData.save((err) => {
    if(err) {
      res.send(err);
    } else {
      res.send('Success');

      // Todo:
      // 1. update mentor and mentee's request feed
      // 2. return success JSON
    }
  });
}

// The mentor accepted the mentoring request
export function acceptRequest(req, res, next) {
  let matchData = new matchSchema();
  matchData.mentor = 'mentor@gmail.com';
  matchData.mentee = 'mentee@gmail.com';

  // Todo:
  // 1. update mentor and mentee's request feed
  // 2. return success JSON
}

// The mentor rejected the mentoring request
export function rejectRequest(req, res, next) {
  let matchData = new matchSchema();
  matchData.mentor = 'mentor@gmail.com';
  matchData.mentee = 'mentee@gmail.com';

  // Todo:
  // 1. update mentor and mentee's request feed
  // 2. return success JSON
}
