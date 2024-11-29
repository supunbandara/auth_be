const ShopModel = require('./ShopModel');

// Regular expression patterns for mobile number and email validation
const mobileNumberPattern = /^[+0-9]{12}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateMobileNumber = (mobileNumber) => mobileNumberPattern.test(mobileNumber);
const validateEmail = (email) => emailPattern.test(email);

const getShopData = async (req, res) => {
    try {
        const results = await ShopModel.getShopNameandLogo();
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const getShop = async (req, res) => {
    try {
        const results = await ShopModel.getAllShops();
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const addShop = async (req, res) => {
    const shop = req.body;

    // Validate mobile number and email
    if (!validateMobileNumber(shop.shopnphonenumber)) {
        res.status(400).send({ error: 'Invalid mobile number' });
        return;
    }

    if (!validateEmail(shop.email)) {
        res.status(400).send({ error: 'Invalid email' });
        return;
    }

    try {
        const shopId = await ShopModel.addShop(shop);
        res.status(200).send({ message: 'Shop created successfully', shopId });
    } catch (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const updateShop = async (req, res) => {
    const { shopId } = req.params;
    const shop = req.body;

    // Validate mobile number and email
    if (shop.shopnphonenumber && !validateMobileNumber(shop.shopnphonenumber)) {
        res.status(400).send({ error: 'Invalid mobile number' });
        return;
    }

    if (shop.email && !validateEmail(shop.email)) {
        res.status(400).send({ error: 'Invalid email' });
        return;
    }

    try {
        const results = await ShopModel.updateShop(shop, shopId);
        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'Shop not found or no changes made' });
        } else {
            res.status(200).send({ message: 'Shop updated successfully' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const updateLogo = async (req, res) => {
    const filePath = req.file.filename; // Get the uploaded file filename

    try {
        await ShopModel.updateLogo(filePath);
        res.status(200).send({ message: 'Logo updated successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error updating logo in the database' });
    }
};

module.exports = {
    getShop,
    addShop,
    updateShop,
    updateLogo,
    getShopData,
};
