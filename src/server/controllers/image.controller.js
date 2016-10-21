import AWS from 'aws-sdk';
import fs from 'fs';
import mongoose from 'mongoose';
import userCallback from '../config/json/user.callback';

AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = '';
AWS.config.secretAccessKey = '';

const User = mongoose.model('user');

export function uploadImage(req, res, next) {
  const imageurl = req.body.url;

  let bucketName = 'yodabucket';
  let readStream = fs.createReadStream(imageurl);
  let Key = 'profile/' + req.session._id + '.png';
  let params = {
    Bucket: bucketName,
    Key: Key,
    ACL: 'public-read',
    Body: readStream,
  };

  const S3 = new AWS.S3();

  S3.putObject(params, function (err, data) {
    // TODO: delete exist key image in s3
    if (!err) {
      let profileUrl = S3.endpoint.href + bucketName + '/' + Key;
      updateProfile(req, profileUrl)
        .then((success) => {
          if (success) {
            res.status(200).json({ msg: userCallback.SUCCESS_PROFILE_UPDATE });
          } else {
            res.status(400).json({ err_point: userCallback.ERR_MONGOOSE });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      throw err;
    }
  });
}

function updateProfile(req, profileUrl) {
  return new Promise((resolve, reject) => {
    User.update({ _id: req.session._id }, {
      $set: { profile_picture: profileUrl },
    }).exec()
      .then((data) => {
        resolve(true);
      })
      .catch((err) => {
        reject(false);
      });
  });
}
