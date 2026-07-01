require("dotenv").config({
  path: require("path").join(__dirname, "..", "..", ".env"),
});

/** @type {import('sequelize-cli').Config} */
module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    },
  },
};
