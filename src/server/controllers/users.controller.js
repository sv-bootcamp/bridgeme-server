import authCallback from '../config/json/auth.callback';
import mongoose from 'mongoose';

const User = mongoose.model('user');
let platform = { facebook: 1, linkedin: 2 };

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

function registerUser(req, res) {
  let user = new User(req.body);
  user.save((err, doc) => {
    if (err) {
      res.status(400).json(authCallback.failRegister);
    } else {
      let cb = authCallback.successRegister;
      cb.result._id = doc._id;
      res.status(200).json(authCallback.successRegister);
      storeSession(req, res);
    }
  });
}

export function signin(req, res, next) {
  let user = req.body;
  if (user.email) {
    User.find({ email: user.email }, (err, doc) => {
      if (err) {
        res.status(400).json(err);
      } else {
        if (doc.length === 0) {
          registerUser(req, res);
        } else {
          storeSession(req, res);
          res.status(200).json(authCallback.successSignin);
        }
      }
    });
  } else {
    res.status(400).json(authCallback.failSignin);
  }
}

function storeSession(req, res) {
  req.session.access_token = req.body.access_token;
  req.session.email = req.body.email;
}
