import mailer from 'nodemailer';
import mailStrings from '../config/json/mail.strings';

/*
 * Define mailing module
 */

// Send mentoring request pushing Email to receiver
export function sendEmail(receiver, subject, html, content) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  let transport
    = mailer.createTransport('smtps://yoda.mentor.lab%40gmail.com:svbootcamp@!@smtp.gmail.com');
  let mailOptions = {
    from: mailStrings.YODA_ACCOUNT,
    to: receiver,
    subject: subject,
    html: html + content,
  };
  transport.sendMail(mailOptions, function (err, response) {
    transport.close();
  });
}
