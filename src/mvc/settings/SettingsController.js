const SettingModal = require('./SettingModal');

const getSettings = async (req, res) => {
    try {
        const results = await SettingModal.getAllSettings();
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const updateSettings = async (req, res) => {
    const { field } = req.params;
    const { value } = req.body;
    try {
        const results = await SettingModal.updateSettings(field, value);
        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'Settings not found or no changes made' });
        } else {
            res.status(200).send({ message: 'Settings updated successfully' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
