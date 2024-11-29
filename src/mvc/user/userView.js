const { format } = require("date-fns");
const userView = {
    renderUser(res, user, token) {
        const { userid, fullname, username, email, phone, address, userroleid } = user;

        const data = {
            userData: {
                fullname,
                email,
                username,
                phone,
                address
            },
            userroleid,
            userid,
            token
        }

        res.send(data);
    },

    renderUserProfileMe( user, access) {
        const { userid, fullname, username, role, email, phonenumber, profileimage,status, address, userroleid, branch_name, branch_location, trndate  } = user;
        const formattedTrndate = format(new Date(trndate), "dd MMM yyyy HH:mm:ss");
        const data = {

            fullname,
            email,
            profileimage,
            accesskey : (access.find((values) => values.userid === userid) ? 'Yes' : ''),
            username,
            phonenumber,
            address,
            userroleid,
            trndate : formattedTrndate,
            role,
            branch_name,
            branch_location,
            userid,
            status
        }

        return data;
    },

    renderSingleUser( user, access) {
        const { userid, fullname, username, email, phone, address, userroleid, phonenumber, status, trndate, profileimage } = user;
        const formattedTrndate = format(new Date(trndate), "dd MMM yyyy HH:mm:ss");
        const data = {

            fullname,
            phonenumber,
            email,
            accesskey : (access.find((values) => values.userid === userid) ? 'Yes' : ''),
            accesskeyid : (access.find((values) => values.userid == userid) || "").key_id || "",
            username,
            trndate : formattedTrndate,
            phone,
            address,
            userroleid,
            profileimage,
            userid,
            status
        }

        return data;
    },

    renderUserAll(user, access) {
        return user.map((user) =>
          this.renderSingleUser(user, access)
        );
      },
};

module.exports = userView;
