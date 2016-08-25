'use strict';

const matchSchema = require('mongoose').model('match');

let matchData = new matchSchema();
let sampleResult = {
  successCode: 1,
  matchData: matchData,
  requestList: {
    accepted: [
      {
        mentorId: 'abc123abc123',
        mentorName: 'Jung Su Kim',
        mentorPic: 'http://789ghi012jkl.jpg',
      },
    ],
    requested: [
      {
        menteeId: 'abc456abc456',
        menteeName: 'Marry Su',
        menteePic: 'http://123abc456def.png',
      },
      {
        menteeId: 'aaa111aaa111',
        menteeName: 'Jane Park',
        menteePic: 'http://123abc456def.png',
      },
    ],
    pending: [
      {
        mentorId: 'aaa222aaa222',
        mentorName: 'Sun Lee',
        mentorPic: 'http://789ghi012jkl.jpg',
      },
      {
        mentorId: 'aaa333aaa333',
        mentorName: 'Harry Potter',
        mentorPic: 'http://789ghi012jkl.jpg',
      },
    ],
  },
};

// The mentee sent request to Mentor
export function requestMentoring(req, res, next) {
  matchData.mentorId = 'mentor_request@gmail.com';
  matchData.menteeId = 'mentee_request@gmail.com';

  matchData.save((err) => {
    if (err) {
      res.send(err);
    } else {
      // Todo:
      // update mentor and mentee's request db

      res.json(sampleResult);
    }
  });
}

// The mentee canceled the mentoring request
export function cancelRequest(req, res, next) {
  matchData.mentor = 'mentor_cancel@gmail.com';
  matchData.mentee = 'mentee_cancel@gmail.com';

  // Todo:
  // update mentor and mentee's request db

  res.json(sampleResult);
}

// The mentor accepted the mentoring request
export function acceptRequest(req, res, next) {
  matchData.mentor = 'mentor_accept@gmail.com';
  matchData.mentee = 'mentee_accept@gmail.com';

  // Todo:
  // update mentor and mentee's request db

  res.json(sampleResult);
}

// The mentor rejected the mentoring request
export function rejectRequest(req, res, next) {
  matchData.mentor = 'mentor_reject@gmail.com';
  matchData.mentee = 'mentee_reject@gmail.com';

  // Todo:
  // update mentor and mentee's request db

  res.json(sampleResult);
}
