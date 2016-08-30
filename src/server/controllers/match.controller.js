'use strict';

const matchSchema = require('mongoose').model('match');
import mailer from 'nodemailer';

/*
 * Methods about mentoring request, accept or reject including E-mail Service
 */

let matchData = new matchSchema();

let sampleSuccessResult = {
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

let sampleFailResult = {
  successCode: 0,
  errPoint: null,
  err: null,
};

// Send mentoring request pushing Email to mentor(receiver)
function sendRequestEmail(req, res, receiver) {
  let transport
    = mailer.createTransport('smtps://yoda.mentor.lab%40gmail.com:svbootcamp@!@smtp.gmail.com');
  let mailOptions = {
    from: '"Yoda Service Team" <yoda.mentor.lab@gmail.com>',
    to: receiver,
    subject: 'New mentee needs your help!',
    text: 'Hi, mentor!',
    html: '<h1>Hi, ' + matchData.mentorName
    + ', </br>new mentee needs your mentoring.</h1><p> - ' + matchData.menteeName + ' sented</p>',
  };

  transport.sendMail(mailOptions, function(err, response){
    if (err){
      sampleFailResult.errPoint = 'RequestMentoring - transport.sendMail';
      sampleFailResult.err = err;

      res.json(sampleFailResult);
    } else {
      sampleSuccessResult.mailOptions = mailOptions;

      res.json(sampleSuccessResult);
    }
    transport.close();
  });
}

// The mentee sent request to Mentor
export function requestMentoring(req, res, next) {
  matchData.mentorId = req.body.mentorId; // Email
  matchData.menteeId = req.body.menteeId;
  matchData.mentorName = req.body.mentorName;
  matchData.menteeName = req.body.menteeName;

  matchData.save((err) => {
    if (err) {
      sampleFailResult.errPoint = 'RequestMentoring - Saving MatchData';
      sampleFailResult.err = err;

      res.json(sampleFailResult);
    } else {
      // Todo:
      // 1. update mentor and mentee's request db

      // 2. Send Request Mail to Mentor
      sendRequestEmail(req, res, 'papermoon703@gmail.com');
    }
  });
}

// The mentor accepted the mentoring request
export function acceptRequest(req, res, next) {
  matchData.mentor = 'mentor_accept@gmail.com';
  matchData.mentee = 'mentee_accept@gmail.com';

  // Todo:
  // update mentor and mentee's request db

  res.json(sampleSuccessResult);
}

// The mentor rejected the mentoring request
export function rejectRequest(req, res, next) {
  matchData.mentor = 'mentor_reject@gmail.com';
  matchData.mentee = 'mentee_reject@gmail.com';

  // Todo:
  // update mentor and mentee's request db

  res.json(sampleSuccessResult);
}
