const nodemailer = require('nodemailer');
const config = require('./config');

const getTranspoter = async () => {
    const options = config.email.environment == 'server' ? {
      service: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      }
    } : {
      service: config.email.host,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      }
    };
  
    const transporter = nodemailer.createTransport(options);
    return transporter;
  };

const sendEmail = async (to, subject, message) => {
    try {
      const transporter = await getTranspoter(); // Await the Promise
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: message
      };
  
      const info = await transporter.sendMail(mailOptions); // Now you can call sendMail
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

const sendEmailWithAttachment = async (to, subject, message, uploadedFile) => {
    try {
        const transporter = await getTranspoter(); // Await the Promise

        console.log(uploadedFile.path);

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: to,
            subject: subject,
            text: message,
            attachments: [
                {
                    filename: uploadedFile.filename,
                    path: uploadedFile.path
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const sendVerificationEmail = async (email, verificationToken, results) => {
    try {
        console.log(email + verificationToken);
        const transporter = await getTranspoter();

        const verificationLink = `${config.backend_url}/api/user/verifyCreateEmail/${verificationToken}`;
        const subject = results[0].subject;
        const text = results[0].text;
        const contact_number = results[0].contact_number;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: subject,
            text: `${text} ${verificationLink} please contact us for any problem or more information ${contact_number}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendEmail, sendEmailWithAttachment, sendVerificationEmail };
