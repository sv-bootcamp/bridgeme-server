import FCM from 'fcm-push';
import mongoose from 'mongoose';

const Key = mongoose.model('key');
const User = mongoose.model('user');

const NOTIFICATION_CONFIG = {
  sound: 'default',
  vibrate: 700,
};

const NOTIFICATION_TYPE = {
  REQUEST: {
    title: 'New Request',
    bodyParam: 'has requested a connection to you.',
  },
  CONNECTION: {
    title: 'New Connection',
    bodyParam: 'and you are connected now.',
  },
  MESSAGE: {
    title: 'New Message',
    bodyParam: 'You’ve got new message.',
  },
};

export function sendPush(receiverId, notificationType, bodyParam) {
  let serverKey = '';
  Key.findOne({ index: 1 }).exec()
    .then((key) => {
      serverKey = key.secretAccessKey;
      return User.findOne({ _id: receiverId }).exec();
    })
    .then((receiverProfile) => {
      receiverProfile.deviceToken.forEach(token => {
        const message = {
          to: token,
          content_available: true,
          notification: {
            title: NOTIFICATION_TYPE[notificationType].title,
            body: generateBody(notificationType, bodyParam),
            sound: NOTIFICATION_CONFIG.sound,
            vibrate: NOTIFICATION_CONFIG.vibrate,
          },
          badge: true,
        };
        const fcm = new FCM(serverKey);
        fcm.send(message)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

function generateBody(notificationType, bodyParam) {
  if (notificationType === 'MESSAGE') {
    return `${bodyParam}`;
  } else {
    return `${bodyParam} ${NOTIFICATION_TYPE[notificationType].bodyParam}`;
  }
};
