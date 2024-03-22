const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});
const { sequelize } = require('../src/models');

module.exports = async () => {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error(err);
  }
};
