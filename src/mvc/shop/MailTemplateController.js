const MailTemplateModal = require("./MailTemplateModal");

const updateMailTemplate = async (req, res) => {
  try {
    const { template_id  } = req.params;
    const { subject, contact_number, text  } = req.body;

    console.log(subject)
    console.log(contact_number)
    console.log(text)

    const updateResults = await MailTemplateModal.updateMailTemplate(template_id, subject, contact_number, text);

    if (updateResults.affectedRows === 0) {
      res
        .status(404)
        .send({ error: "MailTemplate not found or MailTemplate not updated" });
      return;
    }

    res.status(200).send({ message: "MailTemplate updated successfully" });
  } catch (error) {
    console.error(`Error updating  MailTemplate: ${error}`);
    res
      .status(500)
      .send({ error: "Error updating MailTemplate in the database" });
  }
};

const getMailTemplate = async (req, res) => {
  try {
      const results = await MailTemplateModal.getAllMailTemplate();
      res.status(200).send(results);
  } catch (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
  }
};

module.exports = {
    updateMailTemplate,
    getMailTemplate
};
