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
        name: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: 'blue-text-gradient',
        }
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
    },
    category: {
        type: String,
        enum: ['frontend', 'fullstack', 'tools'],
        default: 'frontend',
    }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

