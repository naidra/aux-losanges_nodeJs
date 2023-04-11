const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const { promisify } = require('es6-promisify');
const mailjetTransport = require('nodemailer-mailjet-transport');

// const transport = nodemailer.createTransport({
//     host: process.env.MAIL_HOST,
//     port: process.env.MAIL_PORT,
//     auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS
//     }
// });
const transport = nodemailer.createTransport(mailjetTransport({
    auth: {
        apiKey: process.env.MAIL_MAILJET_KEY,
        apiSecret: process.env.MAIL_MAILJET_SECRET
    }
}));

const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
};

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);
    const mailOptions = {
        from: 'Ardian Sallauka <ardiansallauka@gmail.com>',
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };

    const sendMail = promisify(transport.sendMail).bind(transport);
    return sendMail(mailOptions);

    // return new Promise((resolve, reject) => {
    //     transport.sendMail(mailOptions, function(error, info){
    //         if (error) return resolve(false);
    //         return resolve(info)
    //     });
    // });
};