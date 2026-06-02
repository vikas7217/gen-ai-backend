const nodemailer = require("nodemailer");

exports.notificationService = async function (body) {
  try {
    // Implement your notification logic here
    const createTransport = await nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.NOTIFY_EMAIL, // your email
        pass: process.env.NOTIFY_EMAIL_PASSWORD, // your email password
      },
    });

    // Send mail with defined transport object to the receiver
    const notifyId = await createTransport.sendMail({
      from: process.env.NOTIFY_EMAIL, // sender address
    //   to: body?.to, // list of receivers
    //   subject: body?.subject, // Subject line
    //   text: body?.text, // plain text body
    //   html: body?.html, // html body
    //   attachments: body?.attachments ? body?.attachments : [], // attachments if any
    ...body,
    });

    return notifyId;
  } catch (error) {
    throw new Error(`Error while sending notification : ${error.message}`);
  }
};
