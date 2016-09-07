import authCallback from '../config/json/auth.callback';
import mongoose from 'mongoose';
import request from 'request';

const User = mongoose.model('user');
const platform = { facebook: '1', linkedin: '2' };

//FB Graph API constant vars.
const FB_GRAPH_BASE_URL = 'https://graph.facebook.com/';
const FB_GRAPH_GET_MY_PROFILE_URI = 'me/';
const FB_GRAPH_GET_PICTURE_URI = 'picture/';
const FB_GRAPH_CRAWL_PARAMS = 'name,email,locale,timezone,verified';

// Return all users.
export function getAll(req, res, next) {
  if (typeof req.session.access_token !== 'undefined'
    && req.session.access_token === req.query.access_token) {
    User.find({}, (err, doc) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(204).json(doc);
      }
    });
  } else {
    res.status(400).json(authCallback.failAuth);
  }
}

// Get all user list except logged in user
export function getMentorList(req, res, next) {
  if (typeof req.session.access_token !== 'undefined'
    && req.session.access_token === req.query.access_token) {
    User.find({ email: { $ne: req.session.email } }, (err, doc) => {
      // TODO: Longer term, we should migrate to a UserSummary object
      // that contains subset of fields. For now, we return all fields.
      if (err) {
        res.send(err);
      } else {
        res.send(doc);
      }
    });
  } else {
    res.status(400).json(authCallback.failAuth);
  }
}

// Return my profile.
export function getMyProfile(req, res, next) {
  if (req.session._id) {
    User.findOne({ _id: req.session._id }, (err, doc) => {
      if (err) {
        let cb = authCallback.fail;
        cb.result.msg = err;
        res.status(400).json(cb);
      } else {
        res.status(200).json(doc);
      }
    });
  } else {
    res.status(400).json(authCallback.failAuth);
  }
}

export function getProfileById(req, res, next) {
  if (req.session._id) {
    User.findOne({ _id: req.params._id }, (err, doc) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).json(doc);
      }
    });
  } else {
    res.status(400).json(authCallback.failAuth);
  }
}

export function signin(req, res, next) {
  if (req.body.platform_type === platform.facebook) {
    crawlByAccessTokenFacebook(req.body.access_token, (facebookResult) => {
      if (facebookResult && facebookResult.verified == true) {
        let registrationData = {
          email: facebookResult.email,
          name: facebookResult.name,
          platform_id: facebookResult.id,
          platform_type: req.body.platform_type,
          locale: facebookResult.locale,
          timezone: facebookResult.timezone,
          profile_picture: facebookResult.profile_picture,
        };
        User.findOne({ email: registrationData.email }, (err, user) => {
          if (err) {
            res.status(400).json(err);
          } else {
            if (!user) {
              registerUser(req, res, registrationData);
            } else {
              storeSession(req, res, user);
              res.status(200).json(authCallback.successSignin);
            }
          }
        });
      } else {
        res.status(400).json(authCallback.invalidAccessToken);
      }
    });
  } else if (req.body.platform_type === platform.linkedin) {
    ///TODO : Validiate accesstoken from linkedin API server.
    res.send("Doesn't support yet.");
  } else {
    res.status(400).json(authCallback.invalidPlatform);
  }
}

function storeSession(req, res, user) {
  req.session.access_token = req.body.access_token;
  req.session.email = user.email;
  req.session._id = user._id.toString();
}

function registerUser(req, res, registrationData) {
  let userData = new User(registrationData);
  userData.save((err, user) => {
    if (err) {
      res.status(400).json(authCallback.failRegister);
    } else {
      let cb = authCallback.successRegister;
      cb.result._id = user._id;
      storeSession(req, res, user);
      res.status(200).json(cb);
    }
  });
}

export function crawlByAccessTokenFacebook(accessToken, responseCallback) {
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
