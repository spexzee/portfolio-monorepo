const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company_name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    iconBg: {
        type: String,
        default: '#383E56',
    },
    date: {
        type: String,
        required: true,
    },
    points: [{
        type: String,
        required: true,
    }]
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
