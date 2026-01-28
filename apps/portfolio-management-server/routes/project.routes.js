const express = require('express');
const Project = require('../models/project.model');
const router = express.Router();

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().lean();
        res.status(200).json({ 
            success: true,
            message: 'Projects retrieved successfully',
            projects 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving projects', 
            error: error.message 
        });
    }
});

// Create a new project
router.post('/projects', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating project',
            error: error.message
        });
    }
});

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().lean();
        res.status(200).json({
            success: true,
            message: 'Projects retrieved successfully',
            projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving projects',
            error: error.message
        });
    }
});

// Update an existing project
router.put('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating project',
            error: error.message
        });
    }
});

// Delete a project
router.delete('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
            project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting project',
            error: error.message
        });
    }
});


module.exports = router;
