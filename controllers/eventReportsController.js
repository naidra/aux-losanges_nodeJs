const mongoose = require('mongoose');
const EventReport = mongoose.model('EventReport');
const Mailjet = require('node-mailjet');
const { promisify } = require('es6-promisify');
const mailjetTransport = require('nodemailer-mailjet-transport');

exports.eventReportsPage = async (req, res) => {
    const eventReports = await EventReport.find();
    res.render('eventReports/list', { title: 'Event Reports', eventReports });
};

exports.eventReportCreate = async (req, res) => {
    res.render('eventReports/create', { title: 'Create EventReport' });
};

exports.eventReportCreatePost = async (req, res) => {
    // req.body.author = req.user._id;
    const eventReport = await (new EventReport(req.body)).save();
    req.flash('success', `Successfully Created Event Report ${eventReport.Name}`);
    res.redirect('https://aux-losanges.ch/event-reports/');
};

exports.eventReportEdit = async (req, res) => {
    const eventReport = await EventReport.findOne({ _id: req.params.id });
    res.render('eventReports/edit', { title: 'Change EventReport', eventReport });
};

exports.eventReportEditPost = async (req, res) => {
    const eventReport = await EventReport.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // to return the new updated values
        runValidators: true
    }).exec();


    const transport = nodemailer.createTransport(mailjetTransport({
        auth: {
            apiKey: process.env.MAIL_MAILJET_KEY,
            apiSecret: process.env.MAIL_MAILJET_SECRET
        }
    }));
    
    const mailOptions = {
        from: 'Ardian Sallauka <ardiansallauka@gmail.com>',
        to: req.params.Email,
        subject: "Data about your event has changed",
        Null,
        text: `<div>
            <p>Data for the event has changed to:</p>
            <br>
            <p>NAME: ${req.params.Name}</p>
            <p>Email: ${req.params.Email}</p>
            <p>Seats: ${req.params.Seats}</p>
            <p>Status: ${req.params.Status}</p>
            <p>EventDate: ${req.params.EventDate}</p>
        </div>`
    };

    const sendMail = promisify(transport.sendMail).bind(transport);
    sendMail(mailOptions);

    req.flash('success', `Successfully changed EventReport.`);
    res.redirect('https://aux-losanges.ch/event-reports/');
};

exports.eventReportDelete = async (req, res) => {
    const role = await EventReport.findOneAndDelete({ _id: req.params.id });
    req.flash('success', `Successfully deleted EventReport.`);
    res.redirect('https://aux-losanges.ch/event-reports/');
};