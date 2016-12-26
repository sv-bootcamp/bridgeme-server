import FCM from 'fcm-push';
import mongoose from 'mongoose';

const User = mongoose.model('user');

const FCM_TOKEN = process.env.FCM_TOKEN;

const NOTIFICATION_CONFIG = {
  sound: 'default',
  vibrate: 700,
};

const NOTIFICATION_TYPE = {
  REQUEST: {
    bodyParam: 'has requested a connection to you.',
  },
  CONNECTION: {
    bodyParam: 'and you are connected now.',
  },
  MESSAGE: {
    bodyParam: 'You’ve got new message.',
  },
};

export function sendPush(receiverId, notificationType, bodyParam, extraData = {}) {
  User.findOne({ _id: receiverId }).exec()
    .then((receiverProfile) => {
      receiverProfile.deviceToken.forEach(token => {
        const message = {
          to: token,
          notification: {
            content_available: true,
            body: generateBody(notificationType, bodyParam),
            sound: NOTIFICATION_CONFIG.sound,
            vibrate: NOTIFICATION_CONFIG.vibrate,
          },
          data: {
            notificationType: notificationType,
            extraData: extraData,
          },
          priority: 'high',
        };
        const fcm = new FCM(FCM_TOKEN);
        fcm.send(message)
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function generateBody(notificationType, bodyParam) {
  if (notificationType === 'MESSAGE') {
    return `${bodyParam}`;
  } else {
    return `${bodyParam} ${NOTIFICATION_TYPE[notificationType].bodyParam}`;
  }
}
