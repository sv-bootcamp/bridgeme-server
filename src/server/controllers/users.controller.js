'use strict';

import mongoose from 'mongoose';
const user = mongoose.model('user');
import * as auth from '../config/auth';
import loginCallback from '../config/json/login.callback';

let mockData = {
  userId: 'gildong',
  email: 'abcds@fsdss.com',
  name: '홍길동',
  age: 25,
  field: 'SW Engineer',
  region: 'Seoul',
  skills: 'JAVA',
};

export function testAuth(req, res, next) {
  if (auth.validiateFB(req.body.access_token) == true) {
    res.json('success');
  }else {
    res.json('fail auth.');
  }
}

export function signin(req, res, next) {
  if (auth.validiateFB(req.body.access_token) == true) {
    res.json(loginCallback.success);
  }else {
    res.json(loginCallback.fail);
  }
}

function signup() {

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

}

