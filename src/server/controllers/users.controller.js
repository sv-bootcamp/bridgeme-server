'use strict';

import mongoose from 'mongoose';
const user = mongoose.model('user');
import * as authentication from '../config/auth';
import loginCallback from '../config/json/login.callback';

let mockData = {
  userId: 'gildong',
  email: 'abcds@fsdss.com',
  name: '홍길동',
  age: 25,
  field: 'SW Engineer',
  region: 'Seoul',
  skills: 'JAVA',
  access_token : 'yodaROX',
};

export function auth(req, res, next) {
  let platform = req.body.platform
  let access_token = req.body.access_token;
  let email = req.body.email;



  if(platform == 1 || "FB"){
    if (authentication.validiateFB(access_token) == true) {
      req.session.access_token = access_token;
      req.session.email = email;
      res.json(loginCallback.success);
    }
  } else if (platform == 2 || "LI"){
    if (authentication.validiateLI(access_token) == true) {
      req.session.access_token = access_token;
      req.session.email = email;
      res.json(loginCallback.success);
    }
  }

  res.json(loginCallback.fail);
}

function signup(req, res, next) {


}

export function insertMockData(req, res, next) {
  let userSample = new user(mockData);
  userSample.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Success');
    }
  });
}

export function getAll(req, res, next) {
  user.find((err, doc) => {
    if (err) {
      res.send(err);
    } else {
      console.log(req.session.accessToken);
      res.send(req.session.accessToken);
    }
  });
}

export function getMyProfile(req, res, next) {
  ///TODO : Get person's session and retrieve DBsession.
  req.session


}

