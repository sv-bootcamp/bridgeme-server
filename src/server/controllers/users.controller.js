'use strict';

const user = require('mongoose').model('user');

let mockData = {
  userId: 'gildong',
  email: 'abcds@fsdss.com',
  name: '홍길동',
  age: 25,
  field: 'SW Engineer',
  region: 'Seoul',
  skills: 'JAVA',
};

export function saveTest(req, res, next) {
  let user = new user(mockData);
  user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Success');
    }
  });
}

export function getAll(req, res, next) {
  User.find((err, doc) => {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
}
