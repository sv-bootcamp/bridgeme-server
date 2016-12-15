import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_CREATE_OPTION = { algorithm: 'HS256', expiresIn: '60min' };
const Key = mongoose.model('key');

const jwt_key = Key.findOne({ name: 'jwtKey' }).exec()
  .then((jwtObject) => {
    console.log(jwtObject);
    return jwtObject.key;
  })
  .catch((err) => {

  });

export default {
  apiProtector(req, res, next) {
    const key = 'development';
    jwt.verify(req.headers.access_token, key, function (err, decoded) {
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
    const key = 'development';
    return jwt.sign(this.generatePayload(user), key, JWT_CREATE_OPTION);
  },

  updateAccessToken(previousToken, updateTokenCallback) {
    const key = 'development';
    jwt.verify(previousToken, key, { ignoreExpiration: true }, function (err, decodedUser) {
      if (typeof updateTokenCallback === 'function') {
        updateTokenCallback(err, decodedUser ? this.createAccessToken(decodedUser) : undefined);
      }
    }.bind(this));
  },

};
