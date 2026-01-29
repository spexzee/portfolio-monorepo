const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');

// POST /api/messages - Create new message (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and message are required'
            });
        }

        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message'
        });
    }
});

// GET /api/messages - Get all messages (protected - add auth later)
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch messages'
        });
    }
});

// PATCH /api/messages/:id/read - Mark message as read
router.patch('/:id/read', async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        res.json({ success: true, message });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update message'
        });
    }
});

// DELETE /api/messages/:id - Delete message
router.delete('/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete message'
        });
    }
});

module.exports = router;
