import fs from 'fs';
import jwt from 'jsonwebtoken';

const JWT_CREATE_OPTION = { algorithm: 'HS256', expiresIn: '60min' };
let cert;

if (process.env.NODE_ENV === 'test') {
  cert = 'testkey';
} else {
  cert = fs.readFileSync('./jwt_key.pem');
}

export default {
  apiProtector(req, res, next) {
    jwt.verify(req.headers.access_token, cert, function (err, decoded) {
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
    return jwt.sign(this.generatePayload(user), cert, JWT_CREATE_OPTION);
  },

  updateAccessToken(previousToken, updateTokenCallback) {
    jwt.verify(previousToken, cert, { ignoreExpiration: true }, function (err, decodedUser) {
      if (typeof updateTokenCallback === 'function') {
        updateTokenCallback(err, decodedUser ? this.createAccessToken(decodedUser) : undefined);
      }
    }.bind(this));
  },

};

