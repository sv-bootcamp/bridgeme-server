import mongoose from 'mongoose';

/*
 * Methods for getting tournament list.
 */

const ObjectId = mongoose.Types.ObjectId;

const Match = mongoose.model('match');
const User = mongoose.model('user');

export function getTournamentList(req, res, next) {
  const matchOptions = {
    MATCH_AS_MENTOR: {
      mentor_id: ObjectId(req.user._id),
    },
    MATCH_AS_MENTEE: {
      mentee_id: ObjectId(req.user._id),
    },
  };

  const projectOption = {
    mentee_id: 1,
    mentor_id: 1,
  };

  const localField = {
    mentee: 'mentee_id',
    mentor: 'mentor_id',
  };

  Promise.all([
    findConnection(matchOptions.MATCH_AS_MENTOR, projectOption, localField.mentee),
    findConnection(matchOptions.MATCH_AS_MENTEE, projectOption, localField.mentor),
  ])
    .then((exceptionList) => {
      const defaultFindOption = {
        _id: {
          $ne: req.user._id,
          $nin: exceptionList[0],
          $nin: exceptionList[1],
        },
        mentorMode: {
          $ne: false,
        },
      };

      if (req.params.area === 'All') {
        return User.find(defaultFindOption, { password: 0 })
          .sort({ stamp_login: -1 }).exec();
      } else {
        return User.find({
          _id: defaultFindOption._id,
          mentorMode: defaultFindOption.mentorMode,
          'career.area': req.params.area,
        }, { password: 0 })
          .sort({ stamp_login: -1 }).exec();
      }
    })
    .then((userList) => {
      res.status(200).json(userList);
    })
    .catch((err) => {
      res.status(400).json({ err });
    });
}

function findConnection(matchOption, projectOption, localField) {
  return Match.aggregate([
    {
      $match: matchOption,
    },
    {
      $project: projectOption,
    },
    {
      $lookup: {
        from: 'users',
        localField,
        foreignField: '_id',
        as: 'list',
      },
    },
  ]).exec();
}
