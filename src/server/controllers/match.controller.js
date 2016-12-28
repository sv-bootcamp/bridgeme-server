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

export function getMentorList(req, res, next) {
  let exceptList = [];
  let pendingList = [];

  let project = {
    mentee_id: 1,
    mentor_id: 1,
  };

  let matchOptions = {
    option1: { mentor_id: ObjectId(req.user._id) },
    option2: {
      mentee_id: ObjectId(req.user._id),
      status: MATCH_STATUS.ACCEPTED,
    },
    option3: {
      mentee_id: ObjectId(req.user._id),
      status: MATCH_STATUS.PENDING,
    },
  };

  let localField = {
    mentee: 'mentee_id',
    mentor: 'mentor_id',
  };

  Promise.all([findConnection(matchOptions.option1, project, localField.mentee),
    findConnection(matchOptions.option2, project, localField.mentor),
    findConnection(matchOptions.option3, project, 'mentee_id'),
  ])
    .then((results) => {
      results[0].forEach(user => exceptList.push(user.mentee_id));
      results[1].forEach(user => exceptList.push(user.mentor_id));
      results[2].forEach(user => pendingList.push(user.mentor_id.toString()));

      return User.find({
        _id: {
          $ne: req.user._id,
          $nin: exceptList,
        },
        mentorMode: {
          $ne: false,
        },
      })
        .sort({ stamp_login: -1 }).exec();
    })
    .then((user) => {
      return new Promise((resolve, reject) => {
        let userData = JSON.parse(JSON.stringify(user));
        userData.forEach((item) => {
          if (pendingList.includes(item._id.toString())) {
            item.pending = true;
          }
        });

        resolve(userData);
      });
    })
    .then((initialUserList) => {
      return new Promise((resolve, reject) => {
        let careerFilteredList = {
          full: [],
          idList: [],
        };

        initialUserList.forEach((userItem) => {
          if (checkCareerFilter(userItem.career, req.body.career)) {
            console.log(userItem.name);
            careerFilteredList.full.push(userItem);
            careerFilteredList.idList.push(userItem._id);
          }
        });

        resolve(careerFilteredList);
      });
    })
    .then((careerFilteredList) => {
      return new Promise((resolve, reject) => {
        let filteredList = {
          full: [],
          idList: [],
        };

        careerFilteredList.full.forEach((userItem) => {
          userItem.expertise.forEach((userExpertise) => {
            if (checkExpertiseFilter(req.body.expertise, userExpertise.select)
              && !arrayContainsElement(filteredList.idList, userItem._id)) {
              filteredList.full.push(userItem);
              filteredList.idList.push(userItem._id);
            }
          });
        });

        resolve(filteredList.full);
      });
    })
    .then((filteredList) => {
      res.status(200).json(filteredList);
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
}

function checkExpertiseFilter(arr, val) {
  return arr.some((arrVal) => {
    return val === arrVal.select;
  });
}

function arrayContainsElement(arr, val) {
  return arr.some((arrVal) => {
    return val == arrVal;
  });
}

function checkCareerFilter(userInfo, filter) {
  if (userInfo === undefined) return false;
  else return ((filter.area === 'All' || userInfo.area === filter.area)
    && (filter.role === 'All' || userInfo.role === filter.role)
    && (filter.years === 'All' || userInfo.years === filter.years)
    && (filter.educational_background === 'All'
      || userInfo.educational_background === filter.educational_background));
}

export function countExpectedExpertiseMatching(req, res, next) {
  const careerFilteredList = [];
  let countResult = [0, 0, 0, 0, 0, 0, 0];

  const exceptList = [];
  const project = {
    mentee_id: 1,
    mentor_id: 1,
  };
  let match = {
    mentor_id: ObjectId(req.user._id),
  };
  let localField = {
    mentee: 'mentee_id',
    mentor: 'mentor_id',
  };

  findConnection(match, project, localField.mentee)
    .then((menteeList) => {
      menteeList.forEach(user => exceptList.push(user.mentee_id));
      match = {
        mentee_id: ObjectId(req.user._id),
        status: MATCH_STATUS.ACCEPTED,
      };
      return findConnection(match, project, localField.mentor);
    })
    .then((mentorList) => {
      mentorList.forEach(user => exceptList.push(user.mentor_id));
      return User.find({
        _id: {
          $ne: req.user._id,
          $nin: exceptList,
        },
        mentorMode: {
          $ne: false,
        },
      })
        .sort({ stamp_login: -1 }).exec();
    })
    .then((mentorList) => {
      mentorList.forEach((user) => {
        if (checkCareerFilter(user.career[0], req.body.career)) {
          careerFilteredList.push(user);
        }
      });
    })
    .then(() => {
      careerFilteredList.forEach((user) => {
        user.expertise.forEach((expItem) => {
          countResult[expItem.index]++;
        });
      });
    })
    .then(() => {
      res.status(200).json(countResult);
      return next();
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
}

function findConnection(matchOption, projectOption, localField) {
  return Match.aggregate([{
      $match: matchOption,
    },
    {
      $project: projectOption,
    },
    {
      $lookup: {
        from: 'users',
        localField: localField,
        foreignField: '_id',
        as: 'list',
      },
    },
  ]).exec();
}

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
        return Match.update(
          {
            _id: req.body.match_id,
          },
          {
            status: req.body.option,
            response_date: Date.now(),
          }).exec();
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
