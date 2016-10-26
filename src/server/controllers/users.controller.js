import * as matchController from './match.controller';
import AWS from 'aws-sdk';
import formidable from 'formidable';
import fs from 'fs';
import jobcategory from '../config/json/jobcategory';
import mongoose from 'mongoose';
import request from 'request-promise';
import userCallback from '../config/json/user.callback';

/*
 * Methods about user, register user and handle session
 */

const Key = mongoose.model('key');
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
    User.find({ _id: { $ne: req.session._id } }).sort({ stamp_login: -1 }).exec()
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
          name: facebookResult.name,
          gender: facebookResult.gender,
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

export function getJobCategory(req, res, next) {
  if (req.session._id) {
    res.status(200).json(jobcategory);
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}

export function editProfile(req, res, next) {
  console.log(req);
  //if (req.session._id) {
  let request = JSON.stringify(req.info);
  let editData = {
    name: request.name,
    gender: request.gender,
    languages: request.languages,
    location: request.location,
    about: request.about,
    education: request.education,
    work: request.work,
  };
  User.findOne({ _id: req.session._id, email: { $ne: null } }).exec()
    .then((userWithEmail) => {
      if (!userWithEmail) {
        if (request.email === null || request.email === undefined) {
          res.status(400).json({ err_point: userCallback.ERR_INVALID_UPDATE });
        } else {
          validateEmail(request.email)
            .then((isValid) => {
              return User.update({ _id: req.session._id },
                { $set: { email: request.email }, editData }).exec();
            });
        }
      } else {
        return User.update({ _id: req.session._id }, { $set: editData }).exec();
      }
    })
    .then((updateData) => {
      if (updateData) {
        return uploadImage(req, res);
      } else {
        res.status(400).json({ err_point: userCallback.ERR_INVALID_EMAIL });
      }
    })
    .then((uploadedImage) => {
      if (uploadedImage) {
        res.status(200).json({ msg: userCallback.SUCCESS_UPDATE });
      } else {
        res.status(400).json({ err_point: userCallback.ERR_MONGOOSE });
      }
    })
    .catch((err) => {
      res.status(400).json({ err_msg: err_stack });
    });
  //} else {
  //  res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  //}
}

function validateEmail(req) {
  return new Promise((resolve, reject) => {
    let email = req;
    let filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (filter.test(email)) {
      resolve(true);
    } else {
      reject(false);
    }
  });
}

function uploadImage(req, res, next) {
  return new Promise((resolve, reject) => {
    setKey()
      .then((data) => {
        if (data) {
          let file = null;
          let form = new formidable.IncomingForm();
          form.encoding = 'utf-8';
          form.parse(req, function (err, fields, files) {
            if (err) {
              res.status(400).json({ err_point: userCallback.ERR_IMAGE_PARSE });
            } else {
              file = files.file; // file when postman test.
            }

            let bucketName = 'yodabucket';
            let imageKey = 'profile/' + req.session._id + '.png';
            let readStream = fs.createReadStream(file.path);

            const S3 = new AWS.S3({ region: 'ap-northeast-2' });
            let params = {
              Bucket: bucketName,
              Key: imageKey,
              ACL: 'public-read',
              Body: readStream,
            };
            S3.putObject(params).promise()
              .then((data, err) => {
                if (data) {
                  let profileUrl = S3.endpoint.href + bucketName + '/' + imageKey;
                  return updateProfile(req, profileUrl);
                } else {
                  res.status(400).json({ err_point: userCallback.ERR_AWS_S3 });
                }
              })
              .then((success) => {
                if (success) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
          });
        } else {
          res.status(400).json({ err_point: userCallback.ERR_AWS_KEY });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
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
        reject(false);
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

export function singup(req, res, next) {
  if (req.session._id) {
    User.update({ _id: req.session._id }, {
      $set: {
        job: req.body.job,
        help: req.body.help,
        personality: req.body.personality,
      },
    }).exec()
      .then((data) => {
        res.status(200).json({ msg: userCallback.SUCCESS_SIGNUP });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
}
