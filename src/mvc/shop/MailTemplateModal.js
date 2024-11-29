const util = require('util');
const { connection } = require('../../../config/connection');
const queryAsync = util.promisify(connection.query).bind(connection);

const MailTemplateModal = {
    updateMailTemplate: async (template_id, subject, contact_number, text) => {
        try {
            const query = 'UPDATE mail_template SET subject = ?, text = ?, contact_number = ? WHERE template_id = ?';
            const values = [subject, text, contact_number, template_id];

            const results = await queryAsync(query, values);
            return results;
        } catch (error) {
            throw error;
        }
    },

    getAllMailTemplate: async () => {
        try {
          const results = await queryAsync('SELECT * FROM mail_template');
          return results;
        } catch (error) {
          throw error;
        }
      },

};

module.exports = MailTemplateModal;
