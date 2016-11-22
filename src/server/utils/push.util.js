import FCM from 'fcm-push';
import mongoose from 'mongoose';

const serverKey = 'AAAATC_Jnfw:APA91bE6u80DCTiBgZdI8Fkuc6RHzblvKfWw4gTmFc1aT7Ud1eyGtaSplg8wa6UwOO4CxHa5Hf0orYoh9c8DKxiKrH5DB5QToCiPbwOPwP-eZgLbdvN3s4FH8an4Q0fBk7itK8tEcIQI6dIYnct_j1O2ExGEN9FChg';
const fcm = new FCM(serverKey);

const User = mongoose.model('user');

const NOTIFICATION_CONFIG = {
  sound: 'default',
  vibrate: 700,
};

const NOTIFICATION_TYPE = [
  {
    title: 'New Request',
    bodyParam: ' has requested a connection to you.',
  },
  {
    title: 'New Connection',
    bodyParam: ' and you are connected now.',
  },
  {
    title: 'New Message',
    bodyParam: 'You’ve got new message.',
  },
  {
    title: 'EMPTY Message',
    bodyParam: '',
  }
];

export function sendPush(senderId, receiverId, extraData, notificationType, bodyParam = '') {
  User.findOne({ _id: receiverId }).exec()
    .then(receiverProfile => {
      const message = {
        to: receiverProfile.deviceToken,
        content_available: true,
        notification: {
          title: NOTIFICATION_TYPE[notificationType].title,
          body: generateBody(notificationType, bodyParam),
          sound: NOTIFICATION_CONFIG.sound,
          vibrate: NOTIFICATION_CONFIG.vibrate,
        },
        extraData: extraData,
        badge: true,
      };
      fcm.send(message)
        .then(function (response) {
          return true;
        })
        .catch(function (err) {
          return false;
        });
    })
    .catch((err) => {
      return false;
    });
};

function generateBody(notificationType, bodyParam) {
  if (notificationType) {
    return `${bodyParam}${NOTIFICATION_TYPE[notificationType].bodyParam}`;
  }
};
