import mongoose from 'mongoose';

/*
 * Methods about mentoring request, accept or reject
 */

const ObjectId = mongoose.Types.ObjectId;

const Match = mongoose.model('match');
const User = mongoose.model('user');

export function getTournamentList(req, res, next) {
  let projectOption = {
    mentee_id: 1,
    mentor_id: 1,
  };

  let matchOptions = {
    MATCH_AS_MENTOR: {
      mentor_id: ObjectId(req.user._id),
    },
    MATCH_AS_MENTEE: {
      mentee_id: ObjectId(req.user._id),
    },
  };

  let localField = {
    mentee: 'mentee_id',
    mentor: 'mentor_id',
  };

  Promise.all([
    findConnection(matchOptions.MATCH_AS_MENTOR, projectOption, localField.mentee),
    findConnection(matchOptions.MATCH_AS_MENTEE, projectOption, localField.mentor),
  ])
    .then((results) => {
      let exceptionList = [];

      results[0].forEach(user => exceptionList.push(user.mentee_id));
      results[1].forEach(user => exceptionList.push(user.mentor_id));

      if (req.params.area === 'All') {
        return User.find({
          _id: {
            $ne: req.user._id,
            $nin: exceptionList,
          },
          mentorMode: {
            $ne: false,
          },
        })
          .sort({ stamp_login: -1 }).exec();
      } else {
        return User.find({
          _id: {
            $ne: req.user._id,
            $nin: exceptionList,
          },
          mentorMode: {
            $ne: false,
          },
          "career.area":  req.params.area,
        })
          .sort({ stamp_login: -1 }).exec();
      }
    })
    .then((userList) => {
      res.status(200).json(userList);
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
