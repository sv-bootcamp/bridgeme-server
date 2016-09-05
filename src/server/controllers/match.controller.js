import authCallback from '../config/json/auth.callback';
import matchCallback from '../config/json/match.callback';
import mailer from 'nodemailer';
import mongoose from 'mongoose';

/*
 * Methods about mentoring request, accept or reject including E-mail Service
 *
 * Todo:
 * Connect Database
 * Format the email body
 */

const Match = mongoose.model('match');
const User = mongoose.model('user');

const EMAIL_SUBJECT = 'New mentee needs your help!';
const EMAIL_HTML = '<h1>Hi,</br> new mentee needs your mentoring.</h1>';
const YODA_ACCOUNT = '"Yoda Service Team" <yoda.mentor.lab@gmail.com>';

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
    subject: EMAIL_SUBJECT,
    html: EMAIL_HTML + content,
  };

  transport.sendMail(mailOptions, function (err, response) {
    if (err) {
      matchCallback.fail.errPoint = 'RequestMentoring - transport.sendMail';
      matchCallback.fail = err;
      res.json(matchCallback.fail);
    }
    else {
      res.json(matchCallback.success);
    }
    transport.close();
  });
}

// The mentee sent request to Mentor
export function requestMentoring(req, res, next) {
  // Todo:
  // Get Email address from DB with mentorId and menteeId (ObjectId). It's Email address for test now.
  // Add data to 'matchData'

  if (typeof req.session.access_token !== 'undefined'
    && req.session.access_token === req.body.access_token) {

    let matchData = req.body;
    matchData.mentee_id = req.session._id;
    console.log(matchData)
    let match = new Match(matchData);
    match.save((err) => {
      if (err) {
        matchCallback.fail.errPoint = 'RequestMentoring - Saving MatchData';
        matchCallback.fail.err = err;
        res.json(matchCallback.fail);
      }
      else {
        User.find({ _id: matchData.mentor_id }, (err, doc) => {
          if (err) {
            res.send(err);
          } else {
            if(doc.length !== 0){
              sendRequestEmail(res, doc[0].email, req.session.email , matchData.content);
            }else{
              matchCallback.fail.errPoint = 'RequestMentoring - Can not found mentor.';
              matchCallback.fail.err = err;
              res.json(matchCallback.fail);
            }
          }
        });
      }
    });

  }
  else {
    res.status(400).json(authCallback.failAuth);
  }

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
