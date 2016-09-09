import authCallback from '../config/json/auth.callback';
import matchCallback from '../config/json/match.callback';
import mailer from 'nodemailer';
import mongoose from 'mongoose';

/*
 * Methods about mentoring request, accept or reject including E-mail Service
 */

const Match = mongoose.model('match');
const ObjectId = mongoose.Types.ObjectId;
const User = mongoose.model('user');

const EMAIL_HTML = '<h1>Hi,</br> new mentee needs your mentoring.</h1>';
const EMAIL_SUBJECT = 'New mentee needs your help!';
const YODA_ACCOUNT = '"Yoda Service Team" <yoda.mentor.lab@gmail.com>';

const ACCEPTED = 1;
const PENDING = 2;
const REJECTED = 0;

// Send mentoring request pushing Email to mentor(receiver)
function sendRequestEmail(mentor, content) {
  return new Promise(function (resolve, reject) {
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
          throw new Error('SendEmail - Fail to Send an email.');
        } else {
          resolve();
        }

        transport.close();
      }
    );
  });
}

// The mentee sent request to Mentor
export function requestMentoring(req, res, next) {
  if (req.session._id) {
    let matchData = req.body;
    matchData.mentee_id = req.session._id;
    let match = new Match(matchData);

    Match.findOne({ mentor_id: matchData.mentor_id, mentee_id: matchData.mentee_id }).exec()
      .then(match => {
        if (!match) {
          return User.findOne({ _id: matchData.mentor_id }).exec();
        } else {
          throw new Error('RequestMentoring - Match already exist.');
        }
      })
      .then(mentor => {
        if (mentor) {
          return sendRequestEmail(mentor.email, matchData.content);
        } else {
          throw new Error('RequestMentoring - Cannot found mentor');
        }
      })
      .then(() => {
        return match.save();
      })
      .then(() => {
        res.status(200).json(matchCallback.successSendMail);
      })
      .catch(err => {
        matchCallback.fail.err = err.stack;
        matchCallback.fail.errPoint = err.message;
        res.status(400).json(matchCallback.fail);
      });
  } else {
    res.status(400).json(authCallback.failAuth);
  }
}

export function getMyActivity(req, res, next) {
  if (req.session._id) {
    let activityData = {};
    findMenteeActivityByStatus(req, res, PENDING, (pendingDoc) => {
      activityData['pending'] = pendingDoc;
      findMenteeActivityByStatus(req, res, ACCEPTED, (acceptedDoc) => {
        activityData['accepted'] = acceptedDoc;
        findMenteeActivityByStatus(req, res, REJECTED, (rejectedDoc) => {
          activityData['rejected'] = rejectedDoc;
          findMentorActivity(req, res, (requestedDoc) => {
            activityData['requested'] = requestedDoc;
            res.status(200).json(activityData);
          });
        });
      });
    });
  } else {
    res.status(400).json(authCallback.failAuth);
  }
}

function findMenteeActivityByStatus(req, res, status, callback) {
  Match.aggregate([
    {
      $match: {
        mentee_id: ObjectId(req.session._id),
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
        response_date: 1,
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
        mentor_id:  ObjectId(req.session._id),
        status: 2,
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
        response_date: 1,
      },
    },
  ], (err, doc) => {
    callback(doc);
  });
}

export function responseMentoring(req, res, next) {
  if (req.session._id) {
    Match.update({ _id: req.body.match_id }, { status: req.body.option, response_date: Date.now() }, (err) => {
      if (err) {
        matchCallback.fail.errPoint = 'RequestMentoring - Updating MatchData.';
        matchCallback.fail.err = err;
        res.json(matchCallback.fail);
      } else {
        res.status(200).json(matchCallback.success);
      }
    });
  } else {
    res.status(400).json(authCallback.failAuth);
  }
}
