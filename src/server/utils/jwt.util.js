import fs from 'fs';
import jwt from 'jsonwebtoken';

const JWT_CREATE_OPTION = { algorithm: 'HS256', expiresIn: '60min' };

const KEY_FILE = './jwt_key.pem';
const KEY = process.env.NODE_ENV === 'test' ? 'thisistestsecret' : fs.readFileSync(KEY_FILE);

export default {
  apiProtector(req, res, next) {
    jwt.verify(req.headers.access_token, KEY, function (err, decoded) {
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
    return jwt.sign(this.generatePayload(user), KEY, JWT_CREATE_OPTION);
  },

  updateAccessToken(previousToken, updateTokenCallback) {
    jwt.verify(previousToken, KEY, { ignoreExpiration: true }, function (err, decodedUser) {
      if (typeof updateTokenCallback === 'function') {
        updateTokenCallback(err, decodedUser ? this.createAccessToken(decodedUser) : undefined);
      }
    }.bind(this));
  },

};

