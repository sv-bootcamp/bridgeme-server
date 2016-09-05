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

// Send mentoring request pushing Email to mentor(receiver)
function sendRequestEmail(res, mentor, mentee, content, callback) {
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
      if (typeof callback === 'function')callback(false);
    }
    else {
      if (typeof callback === 'function')callback(true);
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
    console.log(matchData);
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
          Match.find({mentor_id: matchData.mentor_id, mentee_id: matchData.mentee_id}, (err, matchDoc) => { //find match is existing
            if (err) {
              matchCallback.fail.errPoint = 'RequestMentoring - Error occurred when finding matchData';
              matchCallback.fail.err = err;
              res.json(matchCallback.fail);
            }
            else {
              if (matchDoc.length !== 0) {  //if match is already existing
                matchCallback.fail.errPoint = 'RequestMentoring - Match is Already exists';
                matchCallback.fail.err = err;
                res.json(matchCallback.fail);
              }
              else {
                sendRequestEmail(res, mentorDoc[0].email, req.session.email, matchData.content, (result) => {  //try to send email
                  if (result === false) {
                    matchCallback.fail.errPoint = 'RequestMentoring - Fail to send email.';
                    matchCallback.fail.err = err;
                    res.json(matchCallback.fail);
                  }
                  else {
                    match.save((err) => {
                      if (err) {
                        matchCallback.fail.errPoint = 'RequestMentoring - Saving MatchData';
                        matchCallback.fail.err = err;
                        res.json(matchCallback.fail);
                      }
                      else {
                        res.json(matchCallback.successSendMail);
                      }
                    });
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

export function getMyActivity(req, res, next) {
  if (req.session._id) {
    let activityData = {};
    //status of match {pending:2, accepted:1, rejected:0}
    findMenteeActivityByStatus(req, res, 2, (pendingDoc) => {
      activityData['pending'] = pendingDoc;
      findMenteeActivityByStatus(req, res, 1, (acceptedDoc) => {
        activityData['accepted'] = acceptedDoc;
        findMenteeActivityByStatus(req, res, 0, (rejectedDoc) => {
          activityData['rejected'] = rejectedDoc;
          findMentorActivity(req, res, (requestedDoc) => {
            activityData["requested"] = requestedDoc;
            res.json(activityData);
          });
        });
      });
    });
  }
  else {
    res.status(400).json(authCallback.failSignin);
  }
}

function findMenteeActivityByStatus(req, res, status, callback) {
  Match.aggregate([
    {
      $match: {
        mentee_id: req.session._id,
        status: status,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'mentor_id',
        foreignField: '_id',
        as: 'detail',
      },
    },
    {
      $project: {
        status: 1,
        detail: 1,
        request_date: 1,
        response_date: 1
      },
    },
  ], (err, doc) => {
    callback(doc);
  });
}

function findMentorActivity(req, res, callback) {
  Match.aggregate([
    {
      $match: {
         mentor_id: req.session._id,
         status: 2
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'mentee_id',
        foreignField: '_id',
        as: 'detail',
      },
    },
    {
      $project: {
        status: 1,
        detail: 1,
        request_date: 1,
        response_date: 1
      },
    },
  ], (err, doc) => {
    callback(doc);
  });
}

export function responseMentoring(req, res, next) {
  if (req.session._id) {
    Match.update({_id: req.body.match_id}, {status: req.body.option, response_date: Date.now()}, (err) => {
      if (err) {
        matchCallback.fail.errPoint = 'RequestMentoring - Updating MatchData.';
        matchCallback.fail.err = err;
        res.json(matchCallback.fail);
      }
      else {
        res.status(200).json(matchCallback.success);
      }
    });
  }
  else {
    res.status(400).json(authCallback.failSignin);
  }
}
