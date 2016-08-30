'use strict';

const matchSchema = require('mongoose').model('match');
import mailer from 'nodemailer';

/*
 * Methods about mentoring request, accept or reject including E-mail Service
 */

const EMAIL_SUBJECT = 'New mentee needs your help!';
const EMAIL_HTML = '<h1>Hi,</br> new mentee needs your mentoring.</h1>';
const YODA_ACCOUNT = '"Yoda Service Team" <yoda.mentor.lab@gmail.com>';

let matchData = new matchSchema();
let sampleFailResult = {
  successCode: 0,
  errPoint: null,
  err: null,
};

// Send mentoring request pushing Email to mentor(receiver)
function sendRequestEmail(res, receiver, replyTo, content) {
  let transport
    = mailer.createTransport('smtps://yoda.mentor.lab%40gmail.com:svbootcamp@!@smtp.gmail.com');
  let mailOptions = {
    from: YODA_ACCOUNT,
    to: receiver,
    replyTo: replyTo,
    subject: EMAIL_SUBJECT,
    html: EMAIL_HTML + content,
  };

  transport.sendMail(mailOptions, function(err, response){
    if (err){
      sampleFailResult.errPoint = 'RequestMentoring - transport.sendMail';
      sampleFailResult.err = err;
      res.json(sampleFailResult);
    } else {
      res.json('Success');
    }
    transport.close();
  });
}

// The mentee sent request to Mentor
export function requestMentoring(req, res, next) {

  matchData.save((err) => {
    if (err) {
      sampleFailResult.errPoint = 'RequestMentoring - Saving MatchData';
      sampleFailResult.err = err;
      res.json(sampleFailResult);
    } else {
      // Todo:
      // 1. update mentor and mentee's request db

      // 2. Send Request Mail to Mentor
      sendRequestEmail(res, req.body.mentorId, req.body.menteeId, req.body.content);
    }
  });
}

// The mentor accepted the mentoring request
export function acceptRequest(req, res, next) {
  matchData.mentor = 'mentor_accept@gmail.com';
  matchData.mentee = 'mentee_accept@gmail.com';

  // Todo:
  // update mentor and mentee's request db

  res.json('Success');
}

// The mentor rejected the mentoring request
export function rejectRequest(req, res, next) {
  matchData.mentor = 'mentor_reject@gmail.com';
  matchData.mentee = 'mentee_reject@gmail.com';

  // Todo:
  // update mentor and mentee's request db

  res.json('Success');
}
