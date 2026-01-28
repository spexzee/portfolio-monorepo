const express = require('express');
const Technology = require('../models/technology.model');
const router = express.Router();

// Get all technologies
router.get('/technologies', async (req, res) => {
    try {
        const technologies = await Technology.find().lean();
        res.status(200).json({
            success: true,
            message: 'Technologies retrieved successfully',
            technologies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving technologies',
            error: error.message
        });
    }
});

// Get a single technology by ID
router.get('/technologies/:id', async (req, res) => {
    try {
        const technology = await Technology.findById(req.params.id).lean();

        if (!technology) {
            return res.status(404).json({
                success: false,
                message: 'Technology not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Technology retrieved successfully',
            technology
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving technology',
            error: error.message
        });
    }
});

// Create a new technology
router.post('/technologies', async (req, res) => {
    try {
        const technology = new Technology(req.body);
        await technology.save();
        res.status(201).json({
            success: true,
            message: 'Technology created successfully',
            technology
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating technology',
            error: error.message
        });
    }
});

// Update an existing technology
router.put('/technologies/:id', async (req, res) => {
    try {
        const technology = await Technology.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!technology) {
            return res.status(404).json({
                success: false,
                message: 'Technology not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Technology updated successfully',
            technology
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating technology',
            error: error.message
        });
    }
});

// Delete a technology
router.delete('/technologies/:id', async (req, res) => {
    try {
        const technology = await Technology.findByIdAndDelete(req.params.id);

        if (!technology) {
            return res.status(404).json({
                success: false,
                message: 'Technology not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Technology deleted successfully',
            technology
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting technology',
            error: error.message
        });
    }
});

module.exports = router;
