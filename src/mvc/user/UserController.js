const UserModel = require("./UserModel");
const UserroleModel = require("../userrole/UserroleModel");
const userView = require("./userView");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables
const config = require("../../../config/config");
const bcrypt = require("bcrypt");

const {
  sendEmail,
  sendEmailWithAttachment,
  sendVerificationEmail,
} = require("../../../config/mail");
const { getToken } = require("../../../config/token");

const todayLoggedUsers = async (req, res) => {
  try {
    const { branchid } = req.params;
    const userlogdetails = await UserModel.todayLoggedUsers(branchid);

    if (userlogdetails.length === 0) {
      res.status(404).send({ error: "user logs not found" });
      return;
    }

    res.status(200).send(userlogdetails);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const todayLogginRecodsByuser = async (req, res) => {
  try {
    const { userid } = req.params;
    const loginRecords = await UserModel.todayLogginRecodsByuser(userid);

    if (loginRecords.length === 0) {
      res.status(404).send({ error: "Login Records not found for this user" });
      return;
    }

    res.status(200).send(loginRecords);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const login = async (req, res) => {
  // console.log('resultssss', req);
  try {
    const { username, password, location } = req.body;

    const results = await UserModel.getUserByUsernameAndPassword(
      username,
      password
    );

    if (Array.isArray(results) && results.length > 0) {
      const user = results[0];

      if (user.status === 1) {
        const token = generateToken(user.email, user.userroleid);

        if (token) {
          const loginTime = new Date();
          const logid = await UserModel.logUserLogin(
            user.userid,
            location,
            loginTime
          );

          if (logid) {
            userView.renderUser(res, user, token);
            return;
          } else {
            console.error("Error logging user login:", error);
            res.status(500).send({ error: "Error logging user login" });
          }
        } else {
          res.status(401).send({ error: "Server error" });
          return;
        }
      }

      res.status(401).send({ error: "Account is not active" });
      return;
    }

    res.status(401).send({ error: "Invalid username or password" });
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const fogetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.getUserByEmail(email);

    if (!user[0]) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const verificationToken = getToken(user[0].email, "1h");
    const verificationLink = `${config.backend_url}/api/user/verify/${verificationToken}`;
    const emailContent = `
      Hi, ${user[0].fullname}
      
      Your Password reset link is ${verificationLink}. click here to reset password
      `;

    sendEmail(email, "Reset Password", emailContent);
    res
      .status(200)
      .send({ message: "Email Sent successfully. Please verify your email" });
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const restPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const email = decoded.email;
    const existingUser = await UserModel.getUserByEmail(email);

    if (!existingUser[0]) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const redirectUrl = config.frontend_url + "confirm-otp/" + token;
    res.redirect(redirectUrl);
  } catch (tokenError) {
    res.status(400).send({ error: "Token is invalid or expired" });
  }
};

const newPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (newPassword !== confirmPassword) {
      res.status(400).send({ error: "Passwords do not match" });
      return;
    }

    const result = await UserModel.updatePasswordByEmail(email, newPassword);

    if (result) {
      res.status(200).send({ message: "Password Save Success!" });
    } else {
      console.error("Error updating password:", error);
      res.status(500).send({ error: "Error updating password" });
    }
  } catch (tokenError) {
    console.error("Token verification error:", tokenError);
    res.status(400).send({ error: "Token is invalid or expired" });
  }
};

const getAll = async (req, res) => {
  try {
    const results = await UserModel.getAll();
    res.status(200).send(results);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const getAllUserWithPagination = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNumber = parseInt(page, 10);
    const itemsPerPage = parseInt(pageSize, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(itemsPerPage) ||
      pageNumber < 0 ||
      itemsPerPage <= 0
    ) {
      res.status(400).send({ error: "Invalid page or pageSize parameter" });
      return;
    }

    const offset = pageNumber * itemsPerPage;
    const user = await UserModel.getAllUserWithPagination(offset, itemsPerPage);
    const access = await UserModel.getallAccess();

    const getData = userView.renderUserAll(user.results, access ? access : []);
    res.status(200).send({ data: getData, totalItems: user.totalItems });
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userid } = req.params;
    const results = await UserModel.getUserById(userid);

    if (results.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    res.status(200).send(results);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const getUserDetailById = async (req, res) => {
  try {
    const { userid } = req.params;
    const results = await UserModel.getUserDetailsBy(userid);

    if (results.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const access = await UserModel.getAllAccessList();

    if (access) {
      const getData = userView.renderUserProfileMe(results[0], access);
      res.status(200).send([getData]);
    } else {
      res.status(500).send({ error: "Error fetching data from the database" });
    }
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const findUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const results = await UserModel.getUserById(userid);

    if (results.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    res.status(200).send(results);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};
//first

const addUser = async (req, res) => {
  try {
    const user = req.body;

    // Email validation regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if email is valid
    if (!emailRegex.test(user.email)) {
      res.status(400).send({ error: "Invalid email format" });
      return;
    }

    const emailExists = await checkIfEmailExists(user.email);
    if (emailExists) {
      res.status(409).send({ error: "Email already exists" });
      return;
    }

    const phoneNumberExists = await checkIfPhoneNumberExists(user.phonenumber);
    if (phoneNumberExists) {
      res.status(409).send({ error: "Phone number already exists" });
      return;
    }

    const usernameExists = await checkIfUsernameExists(user.username);
    if (usernameExists) {
      res.status(409).send({ error: "Username is already exists" });
      return;
    }

    const userId = await UserModel.addUser(user);
    if (!userId) {
      res.status(500).send({ error: "Failed to create user" });
      return;
    }

    const mailtemplateResults = await UserModel.getMailtemplate();
    if (mailtemplateResults.length === 0) {
      res.status(404).send({ error: "Mailtemplate not found" });
      return;
    }

    const verificationToken = getToken(user.email, "1h");
    sendVerificationEmail(user.email, verificationToken, mailtemplateResults);

    res.status(200).send({
      message: "User created successfully. He/she has to confirm email",
      userId,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send({ error: "Error adding user" });
  }
};

const checkIfEmailExists = async (email) => {
  try {
    const results = await Promise.all([
      UserModel.getUserByEmail(email)
    ]);
    return results.some((result) => result.length > 0);
  } catch (error) {
    throw error;
  }
};

const checkIfPhoneNumberExists = async (phoneNumber) => {
  try {
    const results = await Promise.all([
      UserModel.getUserByPhonenumber(phoneNumber)
    ]);
    return results.some((result) => result.length > 0);
  } catch (error) {
    throw error;
  }
};

const checkIfUsernameExists = async (username) => {
  try {
    const results = await UserModel.getUserByUsername(username);
    return results.length > 0;
  } catch (error) {
    throw error;
  }
};

const validateUser = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const existingUsers = await UserModel.getUserByEmail(email);

    if (!existingUsers[0]) {
      return res.status(404).send({ error: "Dealer not found" });
    }

    await UserModel.updatestatus(existingUsers[0].userid, 1);

    const redirectUrl = "https://mail.google.com"; // Replace with the desired redirect URL
    const htmlResponse = `
                      <!DOCTYPE html>
                      <html lang="en">
                      <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Thank You for Join with Us</title>
                          <style>
                              body {
                                  font-family: Arial, sans-serif;
                                  text-align: center;
                                  padding: 50px;
                              }
                              h1 {
                                  color: #333;
                              }
                              p {
                                  color: #777;
                                  margin-top: 20px;
                              }
                          </style>
                      </head>
                      <body>
                          <h1>Thank You!</h1>
                          <p>Your Account has been successfully verified.</p>
                          <script>
                              setTimeout(function() {
                                  window.location.href = "${redirectUrl}";
                              }, 1000); // Adjust the delay time as needed
                          </script>
                      </body>
                      </html>
                  `;
    return res.status(200).send(htmlResponse);
  } catch (tokenError) {
    return res.status(400).send({ error: "Token is invalid or expired" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const user = req.body;

    const existingUser = await UserModel.getUserById(userid);

    if (!existingUser[0]) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user.phonenumber && user.phonenumber !== existingUser[0].phonenumber) {
      const results = await UserModel.getUserByPhonenumber(user.phonenumber);

      if (results.length > 0) {
        return res.status(409).send({ error: "Phone number already exists" });
      }
    }

    await UserModel.updateUser(user, userid);

    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ error: "Error updating user" });
  }
};

const meUpdateUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const user = req.body;

    const existingUser = await UserModel.getUserById(userid);

    if (!existingUser[0]) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user.phonenumber && user.phonenumber !== existingUser[0].phonenumber) {
      const results = await UserModel.getUserByPhonenumber(user.phonenumber);

      if (results.length > 0) {
        return res.status(409).send({ error: "Phone number already exists" });
      }
    }

    await UserModel.meUpdateUser(user, userid);

    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ error: "Error updating user" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userid } = req.params;
    const filePath = req.file.filename;

    const existingUser = await UserModel.getUserById(userid);

    if (!existingUser[0]) {
      return res.status(404).send({ error: "User not found" });
    }

    await UserModel.updateUserProfile(userid, filePath);

    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send({ error: "Error updating user profile" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userid } = req.params;
    const { currentPassword, password } = req.body;

    if (!currentPassword) {
      return res.status(400).send({ error: "Current password is required" });
    }

    if (!password) {
      return res.status(400).send({ error: "New password is required" });
    }

    const user = await UserModel.getUserById(userid);

    if (!user[0]) {
      return res.status(404).send({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user[0].password);

    if (!isMatch) {
      return res.status(400).send({ error: "Current password is incorrect" });
    }

    await UserModel.updateUserPassword(userid, password);

    res.status(200).send({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send({ error: "Error changing password" });
  }
};

const changeEmail = async (req, res) => {
  try {
    const { userid } = req.params;
    const { currentEmail, newEmail } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!currentEmail || !emailRegex.test(currentEmail)) {
      return res
        .status(400)
        .send({ error: "Invalid or missing current email" });
    }

    if (!newEmail || !emailRegex.test(newEmail)) {
      return res.status(400).send({ error: "Invalid or missing new email" });
    }

    const user = await UserModel.getUserById(userid);

    if (!user[0]) {
      return res.status(404).send({ error: "User not found" });
    }

    if (user[0].email !== currentEmail) {
      return res.status(400).send({ error: "Current email is incorrect" });
    }

    await UserModel.changeEmail(userid, newEmail);

    await UserModel.updatestatus(userid, 0);

    const verificationToken = getToken(newEmail, "1h");
    sendVerificationEmail(newEmail, verificationToken);

    res.status(200).send({
      message:
        "Email changed successfully. Please Verify Email to Active Account. Thank You!",
    });
  } catch (error) {
    console.error("Error changing email:", error);
    res.status(500).send({ error: "Error changing email" });
  }
};

const changeUsername = async (req, res) => {
  try {
    const { userid } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).send({ error: "New username is required" });
    }

    const user = await UserModel.getUserById(userid);

    if (!user[0]) {
      return res.status(404).send({ error: "User not found" });
    }

    const results = await UserModel.getUserByUsername(newUsername);

    if (results.length > 0) {
      return res.status(409).send({ error: "New username already exists" });
    }

    await UserModel.changeUsername(userid, newUsername);

    res.status(200).send({ message: "Username changed successfully" });
  } catch (error) {
    console.error("Error changing username:", error);
    res.status(500).send({ error: "Error changing username" });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { userid } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({ error: "Status is required" });
    }

    const user = await UserModel.getUserById(userid);

    if (!user[0]) {
      return res.status(404).send({ error: "User not found" });
    }

    await UserModel.updatestatus(userid, status);

    res.status(200).send({ message: "Status Updated successfully" });
  } catch (error) {
    console.error("Error changing status:", error);
    res.status(500).send({ error: "Error changing status" });
  }
};

const deleteuser = async (req, res) => {
  const { userid } = req.params;

  try {
    const user = await UserModel.getUserById(userid);

    if (user.length === 0) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    const deleteResults = await UserModel.deleteuser(userid, 1);

    if (deleteResults.affectedRows === 0) {
      res.status(404).send({ error: "Error deleting user or user not found" });
      return;
    }

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error deleting user: ${error}`);
    res.status(500).send({ error: "Error deleting user in the database" });
  }
};

const deleteUsers = async (req, res) => {
  const { deleteids } = req.body;

  if (!Array.isArray(deleteids) || deleteids.length === 0) {
    res.status(400).send({ error: "Invalid user IDs" });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const userId of deleteids) {
    try {
      const results = await UserModel.getUserById(userId);

      if (results.length === 0) {
        failCount++;
      } else {
        const deleteResult = await UserModel.deleteuser(userId, 1);

        if (deleteResult.affectedRows === 0) {
          failCount++;
        } else {
          successCount++;
        }

        // Check if all deletions have been processed
        if (successCount + failCount === deleteids.length) {
          const totalCount = deleteids.length;
          res.status(200).send({
            totalCount,
            successCount,
            failCount,
          });
        }
      }
    } catch (error) {
      failCount++;
    }
  }
};

//Access
const createAccess = async (req, res) => {
  try {
    const { userid, password, branch_id } = req.body;

    const user = await UserModel.getUserById(userid);

    if (user.length > 0) {
      const access = await UserModel.getAccessByUser(userid);
      if (access.length === 0) {
        const key_id = await UserModel.createAccess(
          userid,
          password,
          branch_id
        );
        if (key_id.length === 0) {
          res.status(404).send({ error: "Failed to create Access" });
          return;
        }

        const emailContent = `
          Hi, ${user[0].fullname}
          
          Congratulations!
          Now you have Key Access. This password must not be given to a third party.`;

        sendEmail(user[0].email, "Key Card Access", emailContent);

        res
          .status(200)
          .send({ message: "Access created successfully", key_id });
      } else {
        res.status(404).send({ error: "This User Already Has access!" });
      }
    } else {
      res.status(404).send({ error: "User Not Found!" });
    }
  } catch (error) {
    console.error(`Error adding Access: ${error}`);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const removeAccessPssword = async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await UserModel.getUserById(userid);
    if (user.length > 0) {
      const access = await UserModel.getAccessByUser(userid);
      if (access.length > 0) {
        const key_id = await UserModel.removeAccessByUser(userid);
        if (key_id.length > 0) {
          res.status(404).send({ error: "Failed to Access Remove" });
        } else {
          res.status(200).send({ message: "Access Removed successfully" });
        }
      } else {
        res.status(404).send({ error: "This User does not Have access!" });
      }
    } else {
      res.status(404).send({ error: "User Not Found!" });
    }
  } catch (error) {
    console.error(`Error removing Access: ${error}`);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const checkAccess = async (req, res) => {
  try {
    const { userid } = req.params;

    const Access = await UserModel.getAccessByUser(userid);

    if (Access.length === 0) {
      res.status(404).send({ error: "Access Denied" });
    } else {
      res.status(200).send({ access: true, Access });
    }
  } catch (error) {
    console.error(`Error checking Access: ${error}`);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const checkAccessByPasword = async (req, res) => {
  try {
    const { password } = req.body;

    const access = await UserModel.getAccessByPassword();

    if (access.length === 0) {
      res.status(404).send({ error: "Access Denied" });
    } else {
      const isMatch = await bcrypt.compare(password, access[0].password);

      if (!isMatch) {
        res.status(401).send({ error: "Invalid Password" });
      } else {
        const user = await UserModel.getUserById(access[0].userid);

        if (user.length === 0) {
          res.status(404).send({ error: "User not found" });
        } else {
          const verificationToken = getToken(user[0].email, "1h");
          res.status(200).send({ access: true, token: verificationToken });
        }
      }
    }
  } catch (error) {
    console.error(`Error checking Access by password: ${error}`);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const checkAccessByKeyId = async (req, res) => {
  try {
    const { key_id } = req.params;

    const Access = await UserModel.getAccessByKeyId(key_id);

    if (Access.length === 0) {
      res.status(404).send({ error: "Access Denied" });
    } else {
      const user = await UserModel.getUserById(Access[0].userid);
      if (user.length === 0) {
        res.status(404).send({ error: "Access Denied" });
      } else {
        const verificationToken = getToken(user[0].email, "1h");
        res.status(200).send({ access: true, token: verificationToken });
      }
    }
  } catch (error) {
    console.error(`Error checking Access by key_id: ${error}`);
    res.status(500).send({ error: "Error fetching data from the database" });
  }
};

const newAccessPassword = async (req, res) => {
  const { userid } = req.params;
  const { currentPassword, password, confirm_password } = req.body;

  try {
    if (password !== confirm_password) {
      return res.status(400).send({ error: "Passwords do not match" });
    }

    const user = await UserModel.getUserById(userid);
    if (user.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    const access = await UserModel.getAccessByUser(userid);
    if (access.length === 0) {
      return res.status(404).send({ error: "This user does not have access!" });
    }

    try {
      const isMatch = await bcrypt.compare(currentPassword, access[0].password);

      if (!isMatch) {
        return res.status(400).send({ error: "Current password is incorrect" });
      }

      const affectedRows = await UserModel.updateAccessPasswordByuserid(
        userid,
        password
      );
      console.log(
        `Password updated successfully. Affected rows: ${affectedRows}`
      );

      // Send a success response to the client
      res
        .status(200)
        .send({ message: "Password and access removed successfully" });
    } catch (error) {
      console.error("Error updating password:", error);

      // Send an error response to the client
      res.status(500).send({ error: "Internal Server Error" });
    }
  } catch (tokenError) {
    console.error("Error fetching data from the database:", tokenError);
    return res
      .status(400)
      .send({ error: "Error fetching data from the database" });
  }
};

// Generate token using JWT
function generateToken(email, userroleid) {
  const payload = { email, userroleid };
  const options = { expiresIn: "24h" }; // Token expiration time

  // Sign the token with the secret key from the .env file
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
}

module.exports = {
  todayLoggedUsers,
  todayLogginRecodsByuser,
  login,
  getAll,
  getUserById,
  findUser,
  addUser,
  createAccess,
  getAllUserWithPagination,
  updateUser,
  changePassword,
  changeEmail,
  changeStatus,
  deleteuser,
  deleteUsers,
  updateUserProfile,
  meUpdateUser,
  changeUsername,
  fogetPassword,
  newPassword,
  restPassword,
  validateUser,
  checkAccess,
  newAccessPassword,
  checkAccessByPasword,
  removeAccessPssword,
  checkAccessByKeyId,
  getUserDetailById,
};
