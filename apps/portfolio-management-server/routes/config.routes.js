const express = require('express');
const router = express.Router();
const Config = require('../models/config.model');

// Get config value by key
router.get('/:key', async (req, res) => {
    try {
        const config = await Config.findOne({ key: req.params.key });
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Config not found'
            });
        }
        res.json({
            success: true,
            config
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all configs
router.get('/', async (req, res) => {
    try {
        const configs = await Config.find();
        res.json({
            success: true,
            configs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update or create config (upsert)
router.put('/:key', async (req, res) => {
    try {
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({
                success: false,
                message: 'Value is required'
            });
        }

        const config = await Config.findOneAndUpdate(
            { key: req.params.key },
            { key: req.params.key, value },
            { new: true, upsert: true }
        );

        res.json({
            success: true,
            message: 'Config updated successfully',
            config
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete config
router.delete('/:key', async (req, res) => {
    try {
        const config = await Config.findOneAndDelete({ key: req.params.key });
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Config not found'
            });
        }
        res.json({
            success: true,
            message: 'Config deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
