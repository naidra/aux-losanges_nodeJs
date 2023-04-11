const mongoose = require('mongoose');
const EventReport = mongoose.model('EventReport');
const Mailjet = require('node-mailjet');


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

    const mailjet = Mailjet.apiConnect(
        process.env.MAIL_MAILJET_KEY,
        process.env.MAIL_MAILJET_SECRET,
    );

    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "ardiansallauka@gmail.com",
                        Name: "Aux-losanges Contact"
                    },
                    To: [
                        {
                            Email: req.params.Email,
                            Name: req.params.Name
                        }
                    ],
                    Subject: "Data about your event has changed",
                    TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                    HTMLPart: `<div>
                        <p>Data for the event has changed to:</p>
                        <p>NAME: ${req.params.Name}</p>
                        <p>NAME: ${req.params.Email}</p>
                        <p>NAME: ${req.params.Seats}</p>
                        <p>NAME: ${req.params.Status}</p>
                        <p>NAME: ${req.params.EventDate}</p>
                    </div>`
                }
            ]
        });

    request.then((result) => {
            console.log('result.body: ', result.body)
        })
        .catch((err) => {
            console.log('err.statusCode: ', err.statusCode)
        });

    req.flash('success', `Successfully changed EventReport.`);
    res.redirect('https://aux-losanges.ch/event-reports/');
};

exports.eventReportDelete = async (req, res) => {
    const role = await EventReport.findOneAndDelete({ _id: req.params.id });
    req.flash('success', `Successfully deleted EventReport.`);
    res.redirect('https://aux-losanges.ch/event-reports/');
};