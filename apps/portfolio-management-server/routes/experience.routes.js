const express = require('express');
const Experience = require('../models/experience.model');
const router = express.Router();

// Get all experiences
router.get('/experiences', async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({
            success: true,
            message: 'Experiences retrieved successfully',
            experiences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving experiences',
            error: error.message
        });
    }
});

// Get a single experience by ID
router.get('/experiences/:id', async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id).lean();

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Experience retrieved successfully',
            experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving experience',
            error: error.message
        });
    }
});

// Create a new experience
router.post('/experiences', async (req, res) => {
    try {
        const experience = new Experience(req.body);
        await experience.save();
        res.status(201).json({
            success: true,
            message: 'Experience created successfully',
            experience
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating experience',
            error: error.message
        });
    }
});

// Update an existing experience
router.put('/experiences/:id', async (req, res) => {
    try {
        const experience = await Experience.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Experience updated successfully',
            experience
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating experience',
            error: error.message
        });
    }
});

// Delete an experience
router.delete('/experiences/:id', async (req, res) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);

        if (!experience) {
            return res.status(404).json({
                success: false,
                message: 'Experience not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Experience deleted successfully',
            experience
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting experience',
            error: error.message
        });
    }
});

module.exports = router;
