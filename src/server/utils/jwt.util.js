import fs from 'fs';
import jwt from 'jsonwebtoken';
import userCallback from '../config/json/user.callback';

const JWT_OPTION = { algorithm: 'HS256', expiresIn: '60min' };
const PRIVATE_KEY = fs.readFileSync('./jwt_key.pem');

export default {
  apiProtector(req, res, next) {
    jwt.verify(req.headers.access_token, PRIVATE_KEY, function (err, decoded) {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({ err_point: userCallback.ERR_EXPIRED_ACCESS_TOKEN });
        }else if (err.name === 'JsonWebTokenError') {
          res.status(401).json({ err_point: userCallback.ERR_INVALID_ACCESS_TOKEN });
        }
      } else {
        req.user = decoded;
        req.user.access_token = req.headers.access_token;
        return next();
      }
    });
  },

  generatePayload(user) {
    return { _id: user._id, name: user.name, email: user.email };
  },

  createAccessToken(user) {
    return jwt.sign(this.generatePayload(user), PRIVATE_KEY, JWT_OPTION);
  },

  updateAccessToken(previousToken) {
    return this.createAccessToken(jwt.decode(previousToken));
  },

};

