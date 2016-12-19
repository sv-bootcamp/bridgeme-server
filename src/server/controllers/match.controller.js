import * as mailingUtil from '../utils/mailing.util';
import * as pushUtil from '../utils/push.util';
import userCallback from '../config/json/user.callback';
import mailStrings from '../config/json/mail.strings';
import matchCallback from '../config/json/match.callback';
import mongoose from 'mongoose';

/*
 * Methods about mentoring request, accept or reject
 */

const ObjectId = mongoose.Types.ObjectId;

const Match = mongoose.model('match');
const User = mongoose.model('user');

export const MATCH_STATUS = {
  ACCEPTED: 1,
  PENDING: 2,
  REJECTED: 0,
};

// The mentee sent request to Mentor
export function requestMentoring(req, res, next) {
  let matchData = req.body;
  matchData.mentee_id = req.user._id;
  let match = new Match(matchData);

  Match.findOne({ mentor_id: matchData.mentor_id, mentee_id: matchData.mentee_id }).exec()
    .then((match) => {
      if (!match) {
        return User.findOne({ _id: matchData.mentor_id }).exec();
      } else {
        throw new Error(matchCallback.ERR_MATCH_ALREADY_EXIST);
      }
    })
    .then((mentor) => {
      if (mentor) {
        mailingUtil.sendEmail(mentor.email, mailStrings.REQUEST_SUBJECT,
          `${mailStrings.REQUEST_TITLE}${req.user.name}${mailStrings.REQUEST_BODY}`,
          `${mailStrings.REQUEST_CONTENTS}`);
        pushUtil.sendPush(mentor._id, 'REQUEST', req.user.name);
        return match.save();
      } else {
        throw new Error(matchCallback.ERR_CANNOT_FOUND_MENTOR);
      }
    })
    .then((match) => {
      res.status(201).json({ msg: matchCallback.SUCCESS_REQUEST });
    })
    .catch((err) => {
      res.status(400).json({ err_point: err.message, err: err.stack });
    });
}

export function getMyActivity(req, res, next) {
  let activityData = {};

  findMenteeActivityByStatus(req.user._id, MATCH_STATUS.PENDING)
    .then((pendingDoc) => {
      activityData['pending'] = pendingDoc;
      return findMenteeActivityByStatus(req.user._id, MATCH_STATUS.ACCEPTED);
    })
    .then((acceptedDoc) => {
      activityData['accepted'] = acceptedDoc;
      return findMenteeActivityByStatus(req.user._id, MATCH_STATUS.REJECTED);
    })
    .then((rejectedDoc) => {
      activityData['rejected'] = rejectedDoc;
      return findMentorActivity(req.user._id);
    })
    .then((requestedDoc) => {
      activityData['requested'] = requestedDoc;
      res.status(200).json(activityData);
    })
    .catch((err) => {
      res.status(400).json({ err_point: err.message, err: err.stack });
    });
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
        status: { $ne: 0 },
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
        subjects: 1,
        contents: 1,
      },
    },
  ]).exec();
}

export function responseMentoring(req, res, next) {
  ///todo: Validiate  match_id & option params (Luke Lee)
  if (Number(req.body.option) === MATCH_STATUS.REJECTED) {
    Match.remove({ _id: req.body.match_id }, (err) => {
      if (err) {
        res.status(400).json({ err_point: matchCallback.ERR_MONGOOSE, err: err });
      } else {
        res.status(200).json({ msg: matchCallback.SUCCESS_RESPONSE });
      }
    });
  } else {
    Match.findOne({ _id: req.body.match_id }).exec()
      .then((match) => {
        pushUtil.sendPush(match.mentee_id, 'CONNECTION', req.user.name);
        return Match.update({ _id: req.body.match_id }, { status: req.body.option, response_date: Date.now() }).exec();
      })
      .then((match) => {
        return User.findOne({ _id: match.mentor_id }).exec();
      })
      .then((mentor) => {
        res.status(200).json({ msg: matchCallback.SUCCESS_RESPONSE });
      })
      .catch((err) => {
        res.status(400).json({ err_point: matchCallback.ERR_MONGOOSE, err: err });
      });
  }
}
