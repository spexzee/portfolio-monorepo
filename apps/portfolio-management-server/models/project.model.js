const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    technologies: [{
        type: String,
        required: true,
    }],
    image: {
        type: String,
        required: true,
    },
    source_code_link: {
        type: String,
    },
    demo_link: {
        type: String,
        required: true,
    }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
