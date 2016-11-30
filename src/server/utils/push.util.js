import FCM from 'fcm-push';
import mongoose from 'mongoose';

const User = mongoose.model('user');
const Key = mongoose.model('key');

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
  let fcmToken = '';
  Key.findOne({ name: 'fcmToken' }).exec()
    .then((fcmTokenObject) => {
      fcmToken = fcmTokenObject.key;
      return User.findOne({_id: receiverId}).exec();
    })
    .then((receiverProfile) => {
      receiverProfile.deviceToken.forEach(token => {
        const message = {
          to: token,
          notification: {
            title: NOTIFICATION_TYPE[notificationType].title,
            content_available: true,
            body: generateBody(notificationType, bodyParam),
            sound: NOTIFICATION_CONFIG.sound,
            vibrate: NOTIFICATION_CONFIG.vibrate,
          },
          priority: 'high',
        };
        const fcm = new FCM(fcmToken);
        fcm.send(message);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function generateBody(notificationType, bodyParam) {
  if (notificationType === 'MESSAGE') {
    return `${bodyParam}`;
  }
  else {
    return `${bodyParam} ${NOTIFICATION_TYPE[notificationType].bodyParam}`;
  }
}
