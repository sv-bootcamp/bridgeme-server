import mailer from 'nodemailer';
import mongoose from 'mongoose';

/*
 * Methods about mentoring request, accept or reject including E-mail Service
 *
 * Todo:
 * Connect Database
 * Format the email body
 */

const matchSchema = mongoose.model('match');
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
function sendRequestEmail(res, mentor, mentee, content) {
  let transport
    = mailer.createTransport('smtps://yoda.mentor.lab%40gmail.com:svbootcamp@!@smtp.gmail.com');
  let mailOptions = {
    from: YODA_ACCOUNT,
    to: mentor,
    replyTo: mentee,
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
  // Todo:
  // Get Email address from DB with mentorId and menteeId (ObjectId). It's Email address for test now.
  // Add data to 'matchData'

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
  // Todo:
  // update mentor and mentee's request db

  res.json('Success');
}

// The mentor rejected the mentoring request
export function rejectRequest(req, res, next) {
  // Todo:
  // update mentor and mentee's request db

  res.json('Success');
}
