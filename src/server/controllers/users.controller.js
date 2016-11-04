import * as matchController from './match.controller';
import * as mailingController from './mailing.controller';
import AWS from 'aws-sdk';
import fs from 'fs';
import jobcategory from '../config/json/jobcategory';
import mailStrings from '../config/json/mail.strings';
import mongoose from 'mongoose';
import request from 'request-promise';
import userCallback from '../config/json/user.callback';
import crypto from 'crypto';

/*
 * Methods about user, register user and handle session
 */

const Key = mongoose.model('key');
const Match = mongoose.model('match');
const User = mongoose.model('user');
const platform = { local: '0', facebook: '1', linkedin: '2' };

// FB Graph API constant vars.
const FB_GRAPH_BASE_URL = 'https://graph.facebook.com/';
const FB_GRAPH_GET_MY_PROFILE_URI = 'me/';
const FB_GRAPH_GET_PICTURE_URI = 'picture/';
const FB_GRAPH_CRAWL_PARAMS = 'name,email,locale,timezone,education,work,location,verified';

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
    User.find({ _id: { $ne: req.session._id }, mentorMode: { $ne: false } })
      .sort({ stamp_login: -1 }).exec()
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

export function localSignUp(req, res, next) {
  let cipher = crypto.createCipher('aes256', req.body.password);
  cipher.update(req.body.email, 'ascii', 'hex');
  let cryptoPassword = cipher.final('hex');

  let registrationData = {
    email: req.body.email,
    password: cryptoPassword,
    platform_type: 0,
  };

  validateEmail(registrationData.email)
    .then(result => {
      if (result) {
        return User.findOne({ email: registrationData.email }).exec();
      } else {
        throw new Error(userCallback.ERR_INVALID_EMAIL_FORMAT);
      }
    })
    .then(existingUser => {
      if (existingUser) {
        res.status(201).json({ msg: userCallback.ERR_EXISTING_EMAIL });
      } else {
        return User(registrationData).save();
      }
    })
    .then(registeredUser => {
      return storeSession(req, registeredUser);
    })
    .then(storedUser => {
      if (storedUser) {
        res.status(200).json(storedUser);
      } else {
        throw new Error(userCallback.ERR_FAIL_REGISTER);
      }
    })
    .catch(err => {
      res.status(400).json({ err_point: err.message });
    });
}

export function localSignIn(req, res, next) {
  let cipher = crypto.createCipher('aes256', req.body.password);
  cipher.update(req.body.email, 'ascii', 'hex');
  let cryptoPassword = cipher.final('hex');

  User.findOne({ email: req.body.email }).exec()
    .then(existingUser => {
      if (!existingUser) {
        throw new Error(userCallback.ERR_USER_NOT_FOUND);
      } else {
        if (cryptoPassword === existingUser.password) {
          storeSession(req, existingUser)
            .then((storedUser) => {
              res.status(200).json({ msg: userCallback.SUCCESS_SIGNIN, user: storedUser });
            })
            .catch(err => {
              throw new Error(userCallback.ERR_FAIL_SIGNIN);
            });
        } else {
          throw new Error(userCallback.ERR_WRONG_PASSWORD);
        }
      }
    })
    .catch(function (err) {
      res.status(400).json(err.message);
    });
}

export function requestSecretCode(req, res, next) {
  let date = new Date();
  let dateString = date.toISOString();
  let cipher = crypto.createCipher('aes192', req.body.email);
  let secretCode = cipher.update(dateString, 'utf-8', 'hex');
  secretCode += cipher.final('hex');

  User.findOne({ email: req.body.email }).exec()
    .then(user => {
      if (!user) {
        throw new Error(userCallback.ERR_USER_NOT_FOUND);
      } else {
        // TODO: Save secret code to db and check validaion of it. Only the last one is valid.
        mailingController.sendEmail(req.body.email, mailStrings.RESETPW_SUBJECT,
          mailStrings.RESETPW_HTML, secretCode);

        res.status(200).json({ secretCode: secretCode });
      }
    })
    .catch(err => {
      res.status(400).json(err.message);
    });
}

export function resetPassword(req, res, next) {
  let cipher = crypto.createCipher('aes192', req.body.password);
  cipher.update(req.body.email, 'ascii', 'hex');
  let crytoPassword = cipher.final('hex');

  User.findOne({ email: req.body.email }).exec()
    .then(user => {
      if (!user) {
        throw new Error(userCallback.ERR_USER_NOT_FOUND);
      } else {
        User.update({ email: req.body.email }, { password: crytoPassword }, { upsert: true }).exec()
          .then(updatedUser => {
            res.status(200).json({ msg: userCallback.SUCCESS_RESET_PASSWORD });
          })
          .catch(err => {
            throw new Error(userCallback.ERR_FAIL_RESETPW);
          });
      }
    })
    .catch(err => {
      res.status(400).json({ err_point: err.message });
    });
}

export function signIn(req, res, next) {
  if (req.body.platform_type === platform.facebook) {
    let registrationData;
    crawlByAccessTokenFacebook(req.body.access_token)
      .then((facebookResult) => {
        registrationData = {
          name: facebookResult.name,
          email: facebookResult.email,
          languages: facebookResult.languages,
          location: facebookResult.location ? facebookResult.location.name : undefined,
          education: facebookResult.education,
          work: facebookResult.work,
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
            .then((registeredUser) => {
              return storeSession(req, registeredUser);
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

export function getJobCategory(req, res, next) {
  if (req.session._id) {
    res.status(200).json(jobcategory);
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

export function editGeneralProfile(req, res, next) {
  if (req.session._id) {
    User.findOne({ _id: req.session._id }).exec()
      .then(user => {
        if (user) {
          return validateEmail(req.body.email);
        } else {
          throw err;
        }
      })
      .then((isValid) => {
        if (isValid) {
          let editData = {
            name: req.body.name,
            email: req.body.email,
            languages: req.body.languages,
            location: req.body.location,
            about: req.body.about,
            education: req.body.education,
            work: req.body.work,
          };
          return User.update({ _id: req.session._id }, { $set: editData }).exec();
        } else {
          throw new Error(userCallback.ERR_INVALID_EMAIL_FORMAT);
        }
      })
      .then(updateData => {
        if (updateData) {
          return setKey();
        } else {
          throw new Error(userCallback.ERR_MONGOOSE);
        }
      })
      .then(keyData => {
        if (keyData) {
          if (req.body.image == null) {
            res.status(200).json({ msg: userCallback.SUCCESS_UPDATE_WITHOUT_IMAGE });
          } else {
            let bucketName = 'yodabucket';
            let now = new Date();
            let imageKey = `profile/${req.session._id}/${now.getTime()}.png`;
            let encondedImage = new Buffer(req.body.image, 'base64');

            const S3 = new AWS.S3({ region: 'ap-northeast-2' });
            let params = {
              Bucket: bucketName,
              Key: imageKey,
              ACL: 'public-read',
              Body: encondedImage,
            };
            S3.putObject(params).promise()
              .then((data, err) => {
                if (data) {
                  let profileUrl = `${S3.endpoint.href}${bucketName}/${imageKey}`;
                  return updateProfile(req, profileUrl);
                } else {
                  throw new Error(userCallback.ERR_AWS);
                }
              })
              .then((success) => {
                if (success) {
                  res.status(200).json({ msg: userCallback.SUCCESS_UPDATE });
                } else {
                  throw new Error(userCallback.ERR_MONGOOSE);
                }
              })
              .catch((err) => {
                res.status(400).json({ err_msg: err_stack });
              });
          }
        } else {
          throw new Error(userCallback.ERR_AWS_KEY);
        }
      })
      .catch(err => {
        res.status(400).json(err);
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

function validateEmail(req) {
  return new Promise((resolve, reject) => {
    let email = req;
    let filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (filter.test(email)) {
      resolve(true);
    } else {
      reject(new Error(userCallback.ERR_FAIL_REGISTER));
    }
  });
}

function setKey() {
  return new Promise((resolve, reject) => {
    Key.findOne({ index: 0 }).exec()
      .then((key) => {
        AWS.config.accessKeyId = key.accessKeyId;
        AWS.config.secretAccessKey = key.secretAccessKey;
        resolve(true);
      })
      .catch((err) => {
        reject();
      });
  });
}

function updateProfile(req, profileUrl) {
  return new Promise((resolve, reject) => {
    User.update({ _id: req.session._id }, {
      $set: { profile_picture: profileUrl },
    }).exec()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject();
      });
  });
}

export function editJob(req, res, next) {
  if (req.session._id) {
    User.update({ _id: req.session._id }, {
      $set: {
        job: req.body.job,
      },
    }).exec()
      .then((data) => {
        res.status(200).json({ msg: userCallback.SUCCESS_EDIT });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

export function editHelp(req, res, next) {
  if (req.session._id) {
    User.update({ _id: req.session._id }, {
      $set: {
        help: req.body.help,
      },
    }).exec()
      .then((data) => {
        res.status(200).json({ msg: userCallback.SUCCESS_EDIT });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

export function editPersonality(req, res, next) {
  if (req.session._id) {
    User.update({ _id: req.session._id }, {
      $set: {
        personality: req.body.personality,
      },
    }).exec()
      .then((data) => {
        res.status(200).json({ msg: userCallback.SUCCESS_EDIT });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

export function setMentoringRequestStatus(req, res, next) {
  if (req.session._id) {
    if (req.body.flag === 'true' || req.body.flag === 'false') {
      User.update({ _id: req.session._id }, {
        $set: {
          mentorMode: req.body.flag,
        },
      }).exec()
        .then(update => {
          res.status(200).json({ msg: userCallback.SUCCESS_UPDATE });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(400).json({ err_point: userCallback.ERR_INVALID_PARAMS });
    }
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

export function getMentoringRequestStatus(req, res, next) {
  if (req.session._id) {
    User.findOne({ _id: req.session._id }).exec()
      .then(user => {
        if (user.mentorMode == null) {
          res.status(200).json(true);
        } else {
          res.status(200).json({ result: user.mentorMode });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}
