require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  backend_url: process.env.LOCAL_BACKEND_URL,
  frontend_url: process.env.LOCAL_FRONTEND_URL,
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // host: process.env.RDS_HOSTNAME,
    // user: process.env.RDS_USERNAME,
    // password: process.env.RDS_PASSWORD,
    // database: process.env.RDS_DB_NAME,
  },
  email:{
    environment:process.env.EMAIL_ENVIRONMENT,
    from:process.env.EMAIL_FROM,
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:process.env.EMAIL_SECURE,
  },
  options: {
    encrypt: true, // use encryption to secure the connection (recommended)
  },
};
