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
  },
];

export function sendPush(senderId, receiverId, extraData, notificationType, bodyParam = '') {
  User.findOne({ _id: receiverId }).exec()
    .then(receiverProfile => {
      const message = {
        //to: receiverProfile.deviceToken[0],
        to: 'cRqmMTj61pM:APA91bGu0Na-9JYgdWn828x3DsH5LcK2ZIlJ75rPV1deGWRudMbGiS64fAE72Kh4m8pCMhTPUXinShac9youFfTcrz_pOQ4tEXyPvVI4uZ6W3jaOf4y1W7oJVmH9BPcewphId-K2shqQ',
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
          console.log(response);
        })
        .catch(function (err) {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

function generateBody(notificationType, bodyParam) {
  return `${bodyParam}${NOTIFICATION_TYPE[notificationType].bodyParam}`;
};
