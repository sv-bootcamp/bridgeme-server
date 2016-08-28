'use strict';

import mongoose from 'mongoose';
const User = mongoose.model('user');
import * as authentication from '../config/auth';
import authCallback from '../config/json/auth.callback';

let platform = { facebook: 1, linkedin: 2 };

export function getMyProfile(req, res, next) {
  if (req.session.email) {
    User.find({ email: req.session.email }, (err, doc) => {
      if (err) {
        let json = authCallback.fail;
        json.result.msg = err;
        res.json(json);
      } else {
        res.json(doc);
      }
    });
  } else {
    res.json(authCallback.failAuth);
  }
}

export function getAll(req, res, next) {
  User.find((err, doc) => {
    if (err) {
      res.send(err);
    } else {
      console.log(req.session.accessToken);
      res.json(req.session.accessToken);
    }
  });
}

export function getById(req, res, next) {
  User.find({ _id: req.params._id }, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.json(doc);
    }
  });
}

function registerUser(req, res) {
  let user = new User(req.body);
  user.save((err, doc) => {
    if (err) {
      res.json(authCallback.failRegister);
    } else {
      let cb = authCallback.successRegister;
      cb.result._id = doc._id;
      res.json(authCallback.successRegister);
      storeSession(req, res);
    }
  });
}

function storeSession(req, res) {
  req.session.access_token = req.body.access_token;
  req.session.email = req.body.email;
}

export function signin(req, res, next) {
  let user = req.body;
  if (user.email) {
    User.find({ email: user.email }, (err, doc) => {
      if (err) {
        res.json(err);
      } else {
        if (doc.length == 0) {
          registerUser(req, res);
        } else {
          storeSession(req, res);
          res.json(authCallback.successSignin);
        }
      }
    });
  }else {
    res.json(authCallback.failSignin);
  }
}
