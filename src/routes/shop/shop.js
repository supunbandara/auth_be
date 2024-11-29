const express = require('express');
const {
    getShop,
    addShop,
    updateShop,
    updateLogo,

} = require('../../mvc/shop/ShopController');

const {
    updateMailTemplate,
    getMailTemplate
} = require('../../mvc/shop/MailTemplateController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { uploadLogo } = require('../../../config/fileUpload');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();

    //admin only
    router.post('/create', addShop);
    router.get('/all', authenticateToken, getShop);
    router.put('/update', authorizeAccessControll, updateShop);
    router.put('/logo', uploadLogo.single('logo'), authorizeAccessControll, updateLogo);
    router.use('/getlogo', express.static('src/uploads/shop/'));
    router.get('/getdata',getShop);

    router.get('/mailtemplate/all', authenticateToken, getMailTemplate);
    router.put('/updateMailTemplate/:template_id', authenticateToken, updateMailTemplate);

    return router;
};
