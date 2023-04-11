const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const eventReportSchema = new mongoose.Schema({
    Name: {
        type: String,
        trim: true,
        required: 'Please enter Name!'
    },
    Email: {
        type: String,
        trim: true,
        required: 'Please enter Email!'
    },
    Seats: {
        type: String,
        trim: true,
        required: 'Please enter number of Seats!'
    },
    Status: {
        type: String,
        trim: true,
        required: 'Please enter Status!'
    },
    EventDate: {
        type: String,
        trim: true,
        required: 'Please enter EventDate!'
    },
    created: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals:true },
    toObject: { virtuals:true }
});

// function autopopulate(next) {
//     this.populate('author');
//     next();
// }

// eventReportSchema.pre('find', autopopulate);
// eventReportSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('EventReport', eventReportSchema);