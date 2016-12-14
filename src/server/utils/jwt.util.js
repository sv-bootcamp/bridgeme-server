import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_CREATE_OPTION = { algorithm: 'HS256', expiresIn: '60min' };
const Key = mongoose.model('key');

const jwt_key = Key.findOne({ name: 'jwtKey' }).exec()
  .then((jwtObject) => {
    return jwtObject.key;
  })
  .catch((err) => {

  });

export default {
  apiProtector(req, res, next) {
    jwt.verify(req.headers.access_token, jwt_key.emitted.fulfill[0], function (err, decoded) {
      if (err) {
        res.status(401).json({ err_point: err.message });
      } else {
        req.user = decoded;
        return next();
      }
    });
  },

  generatePayload(user) {
    return { _id: user._id, name: user.name, email: user.email };
  },

  createAccessToken(user) {
    console.log(jwt_key.emitted.fulfill[0]);
    return jwt.sign(this.generatePayload(user), jwt_key.emitted.fulfill[0], JWT_CREATE_OPTION);
  },

  updateAccessToken(previousToken, updateTokenCallback) {
    jwt.verify(previousToken, jwt_key.emitted.fulfill[0], { ignoreExpiration: true }, function (err, decodedUser) {
      if (typeof updateTokenCallback === 'function') {
        updateTokenCallback(err, decodedUser ? this.createAccessToken(decodedUser) : undefined);
      }
    }.bind(this));
  },

};
