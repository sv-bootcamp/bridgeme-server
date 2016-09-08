import userCallback from '../config/json/user.callback';
import matchCallback from '../config/json/match.callback';
import mailer from 'nodemailer';
import mongoose from 'mongoose';

/*
 * Methods about mentoring request, accept or reject including E-mail Service
 */

const ObjectId = mongoose.Types.ObjectId;
const Match = mongoose.model('match');
const User = mongoose.model('user');

const EMAIL_SUBJECT = 'New mentee needs your help!';
const EMAIL_HTML = '<h1>Hi,</br> new mentee needs your mentoring.</h1>';
const YODA_ACCOUNT = '"Yoda Service Team" <yoda.mentor.lab@gmail.com>';

const PENDING = 2;
const ACCEPTED = 1;
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
          throw new Error(matchCallback.failSendMail);
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
          throw new Error(matchCallback.matchAlreadyExist);
        }
      })
      .then(mentor => {
        if (mentor) {
          return sendRequestEmail(mentor.email, matchData.content);
        } else {
          throw new Error(matchCallback.cannotFoundMentor);
        }
      })
      .then(() => {
        return match.save();
      })
      .then(() => {
        res.status(201).json(matchCallback.successSendMail);
      })
      .catch((err) => {
        res.status(400).json({ err_point: err.message, err: err.stack });
      });
  } else {
    res.status(401).json({ err_point: userCallback.failAuth });
  }
}

export function getMyActivity(req, res, next) {
  if (req.session._id) {
    let activityData = {};

    findMenteeActivityByStatus(req.session._id, PENDING)
      .then(pendingDoc => {
        activityData['pending'] = pendingDoc;
        return findMenteeActivityByStatus(req.session._id, ACCEPTED);
      })
      .then(acceptedDoc => {
        activityData['accepted'] = acceptedDoc;
        return findMenteeActivityByStatus(req.session._id, REJECTED);
      })
      .then(rejectedDoc => {
        activityData['rejected'] = rejectedDoc;
        return findMentorActivity(req.session._id);
      })
      .then(requestedDoc => {
        activityData['requested'] = requestedDoc;
        res.status(200).json(activityData);
      })
      .catch(err => {
        res.status(400).json({ err_point: err.message, err: err.stack });
      });
  } else {
    res.status(401).json({ err_point: userCallback.failAuth });
  }
}

function findMenteeActivityByStatus(mentee_id, status) {
  return Match.aggregate([
    {
      $match: {
        mentee_id: ObjectId(mentee_id),
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
  ]).exec();
}

function findMentorActivity(mentor_id) {
  return Match.aggregate([
    {
      $match: {
        mentor_id: ObjectId(mentor_id),
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
  ]).exec();
}

export function responseMentoring(req, res, next) {
  if (req.session._id) {
    Match.update({ _id: req.body.match_id }, { status: req.body.option, response_date: Date.now }, (err) => {
      if (err) {
        res.status(400).json({ err_point: matchCallback.mongooseErr, err: err });
      } else {
        res.status(200).json({ msg: matchCallback.successResponse });
      }
    });
  } else {
    res.status(401).json({ err_point: userCallback.failAuth });
  }
}
