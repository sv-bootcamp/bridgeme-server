import AWS from 'aws-sdk';
import fs from 'fs';
import mongoose from 'mongoose';
import userCallback from '../config/json/user.callback';

AWS.config.accessKeyId = '~/.aws/config.access_key';
AWS.config.secretAccessKey = '~/.aws/config.secret_key';

const User = mongoose.model('user');

export function uploadImage(req, res, next) {
  if (req.session._id) {
    const imageurl = req.body.url;
    // TODO: Need to validate file.
    let bucketName = 'yodabucket';
    let readStream = fs.createReadStream(imageurl);
    let Key = 'profile/' + req.session._id + '.png';

    const S3 = new AWS.S3({ region: 'ap-northeast-2' });
    let params = {
      Bucket: bucketName,
      Key: Key,
      ACL: 'public-read',
      Body: readStream,
    };

    S3.putObject(params).promise()
      .then((data, err) => {
        if (!err) {
          let profileUrl = S3.endpoint.href + bucketName + '/' + Key;
          return updateProfile(req, profileUrl);
        } else {
          throw err;
        }
      })
      .then((success) => {
        if (success) {
          res.status(200).json({ msg: userCallback.SUCCESS_PROFILE_UPDATE });
        } else {
          res.status(400).json({ err_point: userCallback.ERR_MONGOOSE });
        }
      })
      .catch((err) => {
        res.status(400).json({ err_point: userCallback.ERR_AWS_S3 });
      });
  } else {
    res.status(401).json({ err_point: userCallback.ERR_FAIL_AUTH });
  }
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
