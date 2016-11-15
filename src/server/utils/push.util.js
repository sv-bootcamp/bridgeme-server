import FCM from 'fcm-push';
import mongoose from 'mongoose';

const serverKey = 'AAAATC_Jnfw:APA91bE6u80DCTiBgZdI8Fkuc6RHzblvKfWw4gTmFc1aT7Ud1eyGtaSplg8wa6UwOO4CxHa5Hf0orYoh9c8DKxiKrH5DB5QToCiPbwOPwP-eZgLbdvN3s4FH8an4Q0fBk7itK8tEcIQI6dIYnct_j1O2ExGEN9FChg';
const fcm = new FCM(serverKey);

const User = mongoose.model('user');

const NOTIFICATION_CONFIG = {
  sound: 'default',
  vibrate: 700,
};

export default {
  NOTIFICATION_TYPE: {
    NEW_REQUEST: {
      title: 'New Request',
      bodyParam: ' has requested a connection to you.'
    },
    NEW_CONNECTION: {
      title: 'New Connection',
      bodyParam: ' and you are connected now.'
    },
    NEW_MESSAGE: {
      title: 'New Message',
      bodyParam: 'You’ve got new message.'
    },
    DEFAULT: {
      title: 'EMPTY Message',
      bodyParam: ''
    }
  },

  sendPush(userId, extraData, notificationType, bodyParam = '') {
    if (NOTIFICATION_TYPE[notificationType]) {
      User.findOne({_id: userId}).exec()
        .then(userProfile => {
          const message = {
            to: `/topics/${userId}`,
            content_available: true,
            notification: {
              title: notificationType.title,
              body: generateBody(notificationType, bodyParam),
              sound: NOTIFICATION_CONFIG.sound,
              vibrate: NOTIFICATION_CONFIG.vibrate,
            },
            data: extraData,
          };
          fcm.send(message)
            .then(function (response) {
              console.log(response);
            })
            .catch(function (err) {
              console.error(err);
            })
        })
        .catch((err) => {

        });
    }
  },

  generateBody(notificationType, bodyParam){
    if (notificationType) {
      return `${bodyParam}${notificationType.bodyParam}`;
    }
  },
};

