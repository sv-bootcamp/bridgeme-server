import * as matchController from './match.controller';
import mongoose from 'mongoose';
import request from 'request-promise';
import userCallback from '../config/json/user.callback';

/*
 * Methods about user, register user and handle session
 */

const Match = mongoose.model('match');
const User = mongoose.model('user');
const platform = { facebook: '1', linkedin: '2' };

// FB Graph API constant vars.
const FB_GRAPH_BASE_URL = 'https://graph.facebook.com/';
const FB_GRAPH_GET_MY_PROFILE_URI = 'me/';
const FB_GRAPH_GET_PICTURE_URI = 'picture/';
const FB_GRAPH_CRAWL_PARAMS = 'name,email,locale,timezone,education,work,gender,location,verified';

// Return all users.
export function getAll(req, res, next) {
  if (req.session._id) {
    User.find({}).exec()
      .then(getAll => {
        res.status(200).json(getAll);
      })
      .catch((err)=> {
        res.status(400).json({ err_point: userCallback.ERR_MONGOOSE, err: err });
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

// Get all user list except logged in user
export function getMentorList(req, res, next) {
  if (req.session._id) {
    User.find({ email: { $ne: req.session.email } }).sort({ stamp_login: -1 }).exec()
      .then(mentorList => {
        res.status(200).json(mentorList);
      })
      .catch((err) => {
        res.status(400).json({ err_point: userCallback.ERR_MONGOOSE, err: err });
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

// Return my profile.
export function getMyProfile(req, res, next) {
  if (req.session._id) {
    User.findOne({ _id: req.session._id }).exec()
      .then(myProfile => {
        res.status(200).json(myProfile);
      })
      .catch((err) => {
        res.status(400).json({ err_point: userCallback.ERR_MONGOOSE, err: err });
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

// Return profile by _id.
export function getProfileById(req, res, next) {
  if (req.session._id) {
    let userProfile = {};

    User.findOne({ _id: req.params._id }).exec()
      .then(profile => {
        userProfile = JSON.parse(JSON.stringify(profile));
        return Match.findOne({ mentor_id: userProfile._id, mentee_id: req.session._id }).exec();
      })
      .then(matchAsMentee => {
        userProfile.relation = {};
        userProfile.relation.asMentee =
          matchAsMentee ? matchAsMentee.status : matchController.REJECTED;
        return Match.findOne({ mentor_id: req.session._id, mentee_id: userProfile._id }).exec();
      })
      .then(matchAsMentor => {
        userProfile.relation.asMentor =
          matchAsMentor ? matchAsMentor.status : matchController.REJECTED;
        res.status(200).json(userProfile);
      })
      .catch((err) => {
        res.status(400).json({ err_point: userCallback.ERR_MONGOOSE, err: err });
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

export function signin(req, res, next) {
  if (req.body.platform_type === platform.facebook) {
    let registrationData;
    crawlByAccessTokenFacebook(req.body.access_token)
      .then((facebookResult) => {
        registrationData = {
          email: facebookResult.email,
          name: facebookResult.name,
          work: facebookResult.work,
          gender: facebookResult.gender,
          location: facebookResult.location ? facebookResult.location.name : undefined,
          education: facebookResult.education,
          platform_id: facebookResult.id,
          platform_type: req.body.platform_type,
          locale: facebookResult.locale,
          timezone: facebookResult.timezone,
          profile_picture: facebookResult.profile_picture,
        };
        return User.findOne({ email: registrationData.email }).exec();
      })
      .then((existingUser) => {
        if (!existingUser) {
          new User(registrationData).save()
            .then((registerdUser) => {
              return storeSession(req, registerdUser);
            })
            .then((storedUser)=> {
              res.status(201).json(storedUser);
            })
            .catch((err) => {
              res.status(400).json({ err_point: userCallback.ERR_FAIL_REGISTER });
            });
        } else {
          storeSession(req, existingUser)
            .then((storedUser)=> {
              res.status(200).json({ msg: userCallback.SUCCESS_SIGNIN });
            })
            .catch((err) => {
              res.status(400).json({ err_point: userCallback.ERR_FAIL_SIGNIN });
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else if (req.body.platform_type === platform.linkedin) {
    // TODO : Validiate accesstoken from linkedin API server.
    res.status(400).send("Doesn't support yet.");
  } else {
    res.status(400).json({ err_point: userCallback.ERR_INVALID_PLATFORM });
  }
}

function storeSession(req, user) {
  req.session.access_token = req.body.access_token;
  req.session.email = user.email;
  req.session._id = user._id.toString();
  return new Promise((resolve, reject) => {
    User.update({ _id: user._id }, { stamp_login: Date.now() }).exec()
      .then((data) => {
        resolve(user);
      })
      .catch((err) => {
        reject();
      });
  });
}

function crawlByAccessTokenFacebook(accessToken) {
  return new Promise((resolve, reject) => {
    // Crawl user data from facebook by access token.
    let result;
    request({
      method: 'GET',
      url: FB_GRAPH_BASE_URL + FB_GRAPH_GET_MY_PROFILE_URI,
      qs: { fields: FB_GRAPH_CRAWL_PARAMS, access_token: accessToken },
      resolveWithFullResponse: true,
    })
      .then((facebookDataResult) => {
        result = JSON.parse(facebookDataResult.body);

        // if HTTP request&response successfully.
        if (facebookDataResult.statusCode === 200 && result.verified === true) {
          // Crawl user profile_picture from facebook by access token.
          return request({
            method: 'GET',
            url: FB_GRAPH_BASE_URL + (result.id + '/') + FB_GRAPH_GET_PICTURE_URI,
            qs: { type: 'large', redirect: '0' },
            resolveWithFullResponse: true,
          });
        }
      })
      .then((facebookPictureResult) => {
        // if HTTP request&response successfully.
        if (facebookPictureResult.statusCode === 200) {
          result.profile_picture = JSON.parse(facebookPictureResult.body).data.url;
          resolve(result);
        }
      })
      .catch(function (err) {
        reject({ err_point: userCallback.ERR_INVALID_ACCESS_TOKEN });
      });
  });

}
