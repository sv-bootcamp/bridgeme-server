import userCallback from '../config/json/user.callback';
import mongoose from 'mongoose';
import request from 'request';

/*
 * Methods about user, register user and handle session
 */

const User = mongoose.model('user');
const platform = { facebook: '1', linkedin: '2' };

//FB Graph API constant vars.
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
    User.findOne({ _id: req.params._id }).exec()
      .then(findProfileId => {
        res.status(200).json(findProfileId);
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
    crawlByAccessTokenFacebook(req.body.access_token, (facebookResult) => {
      if (facebookResult && facebookResult.verified == true) {
        let registrationData = {
          email: facebookResult.email,
          name: facebookResult.name,
          work: facebookResult.work,
          gender: facebookResult.gender,
          location: facebookResult.location.name,
          education: facebookResult.education,
          platform_id: facebookResult.id,
          platform_type: req.body.platform_type,
          locale: facebookResult.locale,
          timezone: facebookResult.timezone,
          profile_picture: facebookResult.profile_picture,
        };
        User.findOne({ email: registrationData.email }, (err, user) => {
          if (err) {
            res.status(400).json({ err_point: userCallback.ERR_MONGOOSE, err: err });
          } else {
            if (!user) {
              registerUser(req, res, registrationData);
            } else {
              User.update({ _id: user._id }, { stamp_login: Date.now() }).exec()
                .then(() => {
                  storeSession(req, user);
                  res.status(200).json({ msg: userCallback.SUCCESS_SIGNIN });
                });
            }
          }
        });
      } else {
        res.status(400).json({ err_point: userCallback.ERR_INVALID_ACCESS_TOKEN });
      }
    });
  } else if (req.body.platform_type === platform.linkedin) {
    ///TODO : Validiate accesstoken from linkedin API server.
    res.send("Doesn't support yet.");
  } else {
    res.status(400).json({ err_point: userCallback.ERR_INVALID_PLATFORM });
  }
}

function storeSession(req, user) {
  req.session.access_token = req.body.access_token;
  req.session.email = user.email;
  req.session._id = user._id.toString();
}

function registerUser(req, res, registrationData) {
  let userData = new User(registrationData);
  userData.save((err, user) => {
    if (err) {
      res.status(400).json({ err_point: userCallback.ERR_FAIL_REGISTER, err: err });
    } else {
      storeSession(req, user);
      res.status(201).json(user);
    }
  });
}

function crawlByAccessTokenFacebook(accessToken, responseCallback) {
  // Crawl user data from facebook by access token.
  request.get({
      url: FB_GRAPH_BASE_URL + FB_GRAPH_GET_MY_PROFILE_URI,
      qs: { fields: FB_GRAPH_CRAWL_PARAMS, access_token: accessToken },
    },
    (error, response, userBody) => {
      if (!error && response.statusCode == 200) {  // if HTTP request&response successfully.
        let result = JSON.parse(userBody);
        // Crawl user profile_picture from facebook by access token.
        request.get({
            url: FB_GRAPH_BASE_URL + (result.id + '/') + FB_GRAPH_GET_PICTURE_URI,
            qs: { type: 'large', redirect: '0' },
          }, (error, response, pictureBody) => {
            if (!error && response.statusCode == 200) {  // if HTTP request&response successfully.
              result.profile_picture = JSON.parse(pictureBody).data.url;
              responseCallback(result);
            } else {
              responseCallback();
            }
          });
      } else {
        responseCallback();
      }
    });
}
