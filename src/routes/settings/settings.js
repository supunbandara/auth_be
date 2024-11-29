const express = require('express');

const {
    getSettings,
    updateSettings
} = require('../../mvc/settings/SettingsController');

const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = () => {
    const router = express.Router();

    router.get('/all', authenticateToken, getSettings);
    router.put('/update/:field', authenticateToken, updateSettings);

    return router;
};
