require("dotenv").config();

const config = require("./config.js");
const mysql = require("mysql2/promise");

const tableInfo = [
  {
    tableName: "userrole",
    fields: [
      { name: "userroleid", type: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "role", type: "VARCHAR(255)" },
      { name: "trndate", type: "DATETIME" },
      { name: "status", type: "INT(5)" },
      { name: "is_delete", type: "INT(5)" },
    ],
    insert: [
      {
        role: "Super admin",
        trndate: new Date(),
        status: 1,
        is_delete: 0,
      },
      {
        role: "Admin",
        trndate: new Date(),
        status: 1,
        is_delete: 0,
      },
    ],
  },
  {
    tableName: "customer",
    fields: [
      { name: "customer_id", type: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "customer_name", type: "VARCHAR(255)" },
      { name: "customer_phone", type: "VARCHAR(15)" },
      { name: "customer_email", type: "VARCHAR(255)" },
      { name: "trndate", type: "DATETIME" },
      { name: "status", type: "INT(5)" },
      { name: "is_delete", type: "INT(5)" },
    ],
  },
  {
    tableName: "user",
    fields: [
      { name: "userid", type: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "fullname", type: "VARCHAR(255)" },
      { name: "phonenumber", type: "VARCHAR(15)" },
      { name: "address", type: "VARCHAR(255)" },
      { name: "email", type: "VARCHAR(255)" },
      { name: "username", type: "VARCHAR(255)" },
      { name: "password", type: "VARCHAR(255)" },
      { name: "profileimage", type: "VARCHAR(255)" },
      { name: "userroleid", type: "INT(5)" },
      { name: "trndate", type: "DATETIME" },
      { name: "status", type: "INT(5)" },
      { name: "is_delete", type: "INT(5)" },
    ],
    insert: [
      {
        fullname: "Zfrozen",
        phonenumber: "+94771173022",
        address: "Umagiliya PL. 378/2B/4, Polhena, Kelaniya, Sri Lanka",
        email: "zfrozen.dev@gmail.com",
        username: "zfrozen",
        password:
          "$2b$10$6q8xw2tRk3FI7YSa54KIm.V8kZpEVs6qJpNiETTm.nlgCJ6TYpkz.",
        profileimage: "",
        userroleid: 1,
        trndate: new Date(),
        status: 1,
        is_delete: 0,
      },
    ]
  },
  {
    tableName: "user_log",
    fields: [
      { name: "log_id", type: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "userid", type: "INT" },
      { name: "login_time", type: "DATETIME" },
      { name: "location", type: "VARCHAR(255)" },
      { name: "trndate", type: "DATETIME" },
    ]
  },
  {
    tableName: "shop",
    fields: [
      { name: "shopname", type: "VARCHAR(255)" },
      { name: "shopnphonenumber", type: "VARCHAR(15)" },
      { name: "address", type: "VARCHAR(255)" },
      { name: "email", type: "VARCHAR(255)" },
      { name: "website", type: "VARCHAR(255)" },
      { name: "facebook", type: "VARCHAR(255)" },
      { name: "instragram", type: "VARCHAR(255)" },
      { name: "whatsapp", type: "VARCHAR(255)" },
      { name: "logo", type: "VARCHAR(255)" },
    ],
    insert: [
      {
        shopname: "Zfrozen",
        shopnphonenumber: "+94702861680",
        address: "Kalaniya",
        email: "zfrozen.dev@gmail.com",
        website: "zfrozen.com",
        facebook: "zfrozen.facebook.com",
        instragram: "zfrozen@instragram",
        whatsapp: "+94702861680",
        whatsapp: 1,
        logo: "",
      },
    ],
  },
  
  {
    tableName: "permission",
    fields: [
      { name: "permissionid", type: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "permission_code", type: "VARCHAR(255)" },
      { name: "permission_description", type: "VARCHAR(255)" },
      { name: "trndate", type: "DATETIME" },
    ]
  },

  {
    tableName: "assign_permission",
    fields: [
      { name: "assignpermissionid", type: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "permission_code", type: "VARCHAR(255)" },
      { name: "userroleid", type: "VARCHAR(255)" },
      { name: "status", type: "INT(5)" },
      { name: "trndate", type: "DATETIME" },
      { name: "is_delete", type: "INT(5)" },
    ],
  },
  {
    tableName: "notification",
    fields: [
      { name: "notification_id", type: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "title", type: "VARCHAR(255)" },
      { name: "description", type: "VARCHAR(255)" },
      { name: "type", type: "VARCHAR(255)" },
      { name: "reference_id", type: "VARCHAR(255)" },
      { name: "impact_id", type: "VARCHAR(255)" },
      { name: "status", type: "INT(5)" },
      { name: "trndate", type: "DATETIME" },
      { name: "is_delete", type: "INT(5)" },
    ],
  },
  {
    tableName: "access_table",
    fields: [
      { name: "key_id", type: "VARCHAR(12) PRIMARY KEY" },
      { name: "password", type: "VARCHAR(255)" },
      { name: "userid", type: "INT(255)" },
      { name: "status", type: "INT(5)" },
      { name: "trndate", type: "DATETIME" },
      { name: "last_use", type: "DATETIME" },
      { name: "is_delete", type: "INT(5)" },
    ],
    insert: [
      {
        key_id: "KEY000000001",
        password:
          "$2b$10$/FOMN3aDv2iAHXAnAaKM6O5xIKgMZO1vRW0AKOlzrmGv3Fgpvls6u",
        userid: 1,
        last_use: new Date(),
        trndate: new Date(),
        status: 1,
        is_delete: 0,
      },
    ]
  },
  {
    tableName: "access_log",
    fields: [
      { name: "access_log", type: "VARCHAR(12) PRIMARY KEY" },
      { name: "key_id", type: "VARCHAR(255)" },
      { name: "perpose", type: "VARCHAR(255)" },
      { name: "trndate", type: "DATETIME" },
    ]
  },
  {
    tableName: "mail_template",
    fields: [
      { name: "template_id", type: "INT AUTO_INCREMENT PRIMARY KEY" },
      { name: "effect", type: "VARCHAR(255)" },
      { name: "subject", type: "VARCHAR(255)" },
      { name: "text", type: "VARCHAR(5000)" },
      { name: "contact_number", type: "VARCHAR(15)" },
    ],
    insert: [
      {
        subject: "Account Verification",
        effect: "AV",
        text: "Thank you for registering as a user with Apple Center. Please verify your account by clicking the link.",
        contact_number: "0702861680",
      },
    ],
  },

];

// Function to check and set up the tables
async function checkTables() {
  try {
    const pool = await mysql.createPool(config.connection);
    const connection = await pool.getConnection();

    const existingTables = await getExistingTables(connection);
    await createNewTables(connection, existingTables);
    await removeUnusedTables(connection, existingTables);

    connection.release();
    pool.end();
  } catch (err) {
    console.error(err);
  }
}

// Function to get existing table names from the database
async function getExistingTables(connection) {
  const [rows] = await connection.query(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${config.connection.database}'`
  );
  return rows.map((row) => row.TABLE_NAME);
}

// Function to create new tables and add indexes if needed
async function createNewTables(connection, existingTables) {
  for (const table of tableInfo) {
    if (!existingTables.includes(table.tableName)) {
      const fieldsString = table.fields
        .map((field) => `${field.name} ${field.type}`)
        .join(", ");

      // Create the table with the defined fields
      const createQuery = `CREATE TABLE ${table.tableName} (${fieldsString})`;
      await connection.query(createQuery);
      console.log(`Table '${table.tableName}' created!`);

      if (table.foreignKeys) {
        for (const foreignKey of table.foreignKeys) {
          const foreignKeyQuery = `ALTER TABLE ${table.tableName
            } ADD CONSTRAINT ${foreignKey.name
            } FOREIGN KEY (${foreignKey.columns.join(", ")}) REFERENCES ${foreignKey.referencedTable
            }(${foreignKey.referencedColumns.join(", ")})`;
          await connection.query(foreignKeyQuery);
          console.log(
            `Foreign key '${foreignKey.name}' added to table '${table.tableName}'`
          );
        }
      }

      // Add indexes after creating the table
      if (table.indexes) {
        for (const index of table.indexes) {
          const indexQuery = `ALTER TABLE ${table.tableName} ADD INDEX ${index.name
            } (${index.columns.join(", ")})`;
          await connection.query(indexQuery);
          console.log(
            `Index '${index.name}' added to table '${table.tableName}'`
          );
        }
      }

      if (table.insert && table.insert.length > 0) {
        for (const item of table.insert) {
          const insertData = { ...item }; // Spread the data to avoid modifying the original object
          const insertQuery = `INSERT INTO ${table.tableName} SET ?`;
          await connection.query(insertQuery, insertData);
          console.log(`Data inserted into table '${table.tableName}'`);
        }
      }
    } else {
      await checkAndAlterFields(connection, table);
    }
  }
}

// Function to check and alter fields in existing tables if needed
async function checkAndAlterFields(connection, table) {
  const [columns] = await connection.query(
    `SHOW COLUMNS FROM ${table.tableName}`
  );
  const existingFields = columns.map((column) => column.Field);
  const fieldsToAdd = table.fields.filter(
    (field) => !existingFields.includes(field.name)
  );
  const fieldsToRemove = existingFields.filter(
    (field) => !table.fields.some((f) => f.name === field)
  );

  if (fieldsToAdd.length > 0) {
    await addFieldsToTable(connection, table.tableName, fieldsToAdd);
  }

  if (fieldsToRemove.length > 0) {
    await removeFieldsFromTable(connection, table.tableName, fieldsToRemove);
  }
}

// Function to add new fields to an existing table
async function addFieldsToTable(connection, tableName, fieldsToAdd) {
  for (const field of fieldsToAdd) {
    const addQuery = `ALTER TABLE ${tableName} ADD COLUMN ${field.name} ${field.type}`;
    await connection.query(addQuery);
    console.log(`Field '${field.name}' added to table '${tableName}'`);
  }
}

// Function to remove fields from an existing table
async function removeFieldsFromTable(connection, tableName, fieldsToRemove) {
  for (const field of fieldsToRemove) {
    const removeQuery = `ALTER TABLE ${tableName} DROP COLUMN ${field}`;
    await connection.query(removeQuery);
    console.log(`Field '${field}' removed from table '${tableName}'`);
  }
}

// Uncomment and use this function to remove unused tables

async function removeUnusedTables(connection, existingTables) {
  for (const existingTable of existingTables) {
    const tableExists = tableInfo.some(
      (table) => table.tableName === existingTable
    );
    if (!tableExists) {
      const removeQuery = `DROP TABLE ${existingTable}`;
      await connection.query(removeQuery);
      console.log(`Table '${existingTable}' removed`);
    }
  }
}

// Export the necessary functions and tableInfo
module.exports = { checkTables, tableInfo };