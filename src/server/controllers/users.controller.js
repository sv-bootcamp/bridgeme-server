'use strict'
const User = require('mongoose').model('User')

let mockData = {
  userId: "gildong",
  email: "abcds@fsdss.com",
  name: "홍길동",
  age: 25,
  field: 'SW Engineer',
  region: "seoul",
  skills: "JAVA"
}

export function saveTest(req, res, next) {
  let user = new User(mockData)
  user.save(() => {
    res.send(arguments)
  })
}

export function getOne(req, res, next) {
  let id = req.params.id
  res.send(id)
}
