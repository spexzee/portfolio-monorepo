const express = require('express');
const router = express.Router();
const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Get authentication parameters for client-side upload
router.get('/auth', (req, res) => {
    try {
        const authParams = imagekit.getAuthenticationParameters();
        res.json({
            success: true,
            ...authParams,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Server-side upload (for files sent from client)
router.post('/upload', async (req, res) => {
    try {
        const { file, fileName, folder } = req.body;

        if (!file || !fileName) {
            return res.status(400).json({
                success: false,
                message: 'File and fileName are required'
            });
        }

        const uploadResponse = await imagekit.upload({
            file: file, // base64 encoded file
            fileName: fileName,
            folder: folder || '/portfolio',
            useUniqueFileName: true
        });

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: uploadResponse.url,
                fileId: uploadResponse.fileId,
                name: uploadResponse.name,
                filePath: uploadResponse.filePath,
                thumbnailUrl: uploadResponse.thumbnailUrl
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete file from ImageKit
router.delete('/:fileId', async (req, res) => {
    try {
        await imagekit.deleteFile(req.params.fileId);
        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
