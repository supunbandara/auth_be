const express = require('express');

const { login,
    getAll,
    getUserById,
    changeUsername,
    getAllUserWithPagination,
    meUpdateUser,
    updateUserProfile,
    addUser,
    updateUser,
    changeEmail,
    deleteUsers,
    findUser,
    changePassword,
    changeStatus,
    validateUser,
    restPassword,
    fogetPassword,
    newPassword,
    deleteuser,
    createAccess,
    checkAccess,
    checkAccessByPasword,
    checkAccessByKeyId,
    removeAccessPssword,
    getUserDetailById,
    newAccessPassword,
    todayLoggedUsers,
    todayLogginRecodsByuser,
} = require('../../mvc/user/UserController');



const { authenticateToken, authorizeValidateUser } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');
const { uploadProfile } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    //login and create
    router.post('/create', addUser);
    router.post('/login', login);
    router.get('/verifyCreateEmail/:token', validateUser);

    router.post('/forget-password', fogetPassword);
    router.get('/verify/:token', restPassword);
    router.post('/reset-password/:token', newPassword);

    //admin controls
    router.get('/all', authorizeAccessControll, getAll);
    router.get('/allWithPagination', authorizeAccessControll, getAllUserWithPagination);
    router.get('/:userid', authenticateToken, findUser);
    router.put('/status/:userid', authorizeAccessControll, changeStatus);
    router.delete('/delete/:userid', authorizeAccessControll, deleteuser);
    router.put('/delete', authorizeAccessControll, deleteUsers);
    router.put('/update/:userid', authorizeAccessControll, updateUser);
    router.use('/getprofile', express.static('src/uploads/profile/'));

    //profile
    router.get('/me/:userid', authorizeValidateUser, getUserDetailById);
    router.put('/me/profilechange/:userid', uploadProfile.single('profile'), authorizeValidateUser, updateUserProfile);
    router.use('/me/getprofile', express.static('src/uploads/profile/'));
    router.put('/me/update/:userid', authorizeValidateUser, meUpdateUser);
    router.put('/me/changePassword/:userid', authorizeValidateUser, changePassword);
    router.put('/me/changeEmail/:userid', authorizeValidateUser, changeEmail);
    router.put('/me/changeUsername/:userid', authorizeValidateUser, changeUsername);
    // router.put('/me/deleteme/:userid', authorizeValidateUser, deleteuser);


    //user access table apis
    router.post('/createAccess', authenticateToken, createAccess);
    router.get('/check-access/:userid', authenticateToken, checkAccess);
    router.post('/use-password', authenticateToken, checkAccessByPasword);
    router.get('/usekey/:key_id', authenticateToken, checkAccessByKeyId);
    router.delete('/remove-access/:userid', authenticateToken, removeAccessPssword);
    router.put('/change-accesspassword/:userid', authorizeValidateUser, newAccessPassword);

    //user log api
    router.get('/todayLoggedUsers/:branchid', authenticateToken, todayLoggedUsers);
    router.get('/todayLogginRecodsByuser/:userid', authenticateToken, todayLogginRecodsByuser);

    return router;
};
