import request from 'request';
import authCallback from '../config/json/auth.callback';
import mongoose from 'mongoose';

const User = mongoose.model('user');
let platform = { facebook: '1', linkedin: '2' };

// Return all users.
export function getAll(req, res, next) {
  if (typeof req.session.access_token !== 'undefined' && req.session.access_token === req.query.access_token) {
    User.find((err, doc) => {
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
  if (req.session.email) {
    User.find({ email: req.session.email }, (err, doc) => {
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
  if (typeof req.session.access_token !== 'undefined' && req.session.access_token === req.query.access_token) {
    User.find({ _id: req.params._id }, (err, doc) => {
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

function registerUser(req, res, registerData) {
  let userData = new User(registerData);
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

export function signin(req, res, next) {
  if (req.body.platform_type === platform.facebook) {
    validateAccessTokenFacebook(req.body.access_token, (facebookResult) => {
      if (facebookResult && facebookResult.verified == true) {
        let registerData = {
          email: facebookResult.email,
          name: facebookResult.name,
          platform_id: facebookResult.id,
          platform_type: req.body.platform_type,
          locale: facebookResult.locale,
          timezone: facebookResult.timezone,
          profile_picture: facebookResult.profile_picture,
        };
        User.findOne({ email: registerData.email }, (err, user) => {
          if (err) {
            res.status(400).json(err);
          } else {
            if (!user) {
              registerUser(req, res, registerData);
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
  req.session._id = user._id;
}

function validateAccessTokenFacebook(accessToken, callback) {
  //Crawl user data from facebook by access token.
  request.get('https://graph.facebook.com/me?fields=name,email,locale,timezone,verified&access_token='
    + accessToken, function (error, response, userBody) {
    if (!error && response.statusCode == 200) {
      let result = JSON.parse(userBody);
      //Crawl user profile_picture from facebook by access token.
      request.get('https://graph.facebook.com/'
        + result.id
        + '/picture?type=large&redirect=0', function (error, response, pictureBody) {
        if (!error && response.statusCode == 200) {
          result.profile_picture = JSON.parse(pictureBody).data.url;
          console.log(result);
          callback(result);
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  });
}

function validateAccessTokenLinkedIn(accessToken) {
  ///TODO : Validiate accesstoken from linkedin API server.
  return false;
}
