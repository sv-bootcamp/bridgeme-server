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
      res.json(matchCallback.successSendMail);
    }

    transport.close();
  });
}

// The mentee sent request to Mentor
export function requestMentoring(req, res, next) {
  if (typeof req.session.access_token !== 'undefined'
    && req.session.access_token === req.body.access_token) {
    let matchData = req.body;
    matchData.mentee_id = req.session._id;
    let match = new Match(matchData);

    User.find({_id: matchData.mentor_id}, (err, mentorDoc) => {  //find mentor_id is existing.
      if (err) {
        matchCallback.fail.errPoint = 'RequestMentoring - Error occurred when finding montor_id';
        matchCallback.fail.err = err;
        res.json(matchCallback.fail);
      }
      else {
        if (mentorDoc.length === 0) {  //if mentor_id is not existing
          matchCallback.fail.errPoint = 'RequestMentoring - Cannot found mentor.';
          matchCallback.fail.err = err;
          res.json(matchCallback.fail);
        }
        else {
          Match.find({ mentor_id: matchData.mentor_id, mentee_id: matchData.mentee_id  }, (err, matchDoc) => { //find match is existing
            if (err) {
              matchCallback.fail.errPoint = "RequestMentoring - Error occurred when finding matchData";
              matchCallback.fail.err = err;
              res.json(matchCallback.fail);
            } else {
              if(matchDoc.length !== 0 ){  //if match is already existing
                matchCallback.fail.errPoint = "RequestMentoring - Match is Already exists";
                matchCallback.fail.err = err;
                res.json(matchCallback.fail);
              }else{
                match.save((err) => {
                  if (err) {
                    matchCallback.fail.errPoint = 'RequestMentoring - Saving MatchData';
                    matchCallback.fail.err = err;
                    res.json(matchCallback.fail);
                  }
                  else {
                    sendRequestEmail(res, mentorDoc[0].email, req.session.email, matchData.content);
                  }
                });
              }
            }
          });
        }
      }
    });

  }
  else {
    res.status(400).json(authCallback.failAuth);
  }
}

export function getActivity(req, res, next) {

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
