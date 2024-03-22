'use strict';
const bcrypt = require('bcrypt');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ UserRole }) {
      // define association here
      // this.hasOne(UserRole, { foreignKey: 'role_id', as: 'user_role' });
    }
    async isPasswordValid(plainTextPassword) {
      return (
        typeof plainTextPassword === 'string' &&
        (await bcrypt.compare(plainTextPassword, this.password))
      );
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      role_id: {
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 100],
            msg: 'Name length must be between 10 and 100 characters'
          },
        }
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          isEmail: { msg: 'Email is not valid' },
          notNull: { msg: 'Email is required' },
          isLowercase: { msg: 'Email must be lowercase' },
          len: {
            args: [10, 100],
            msg: 'Email length must be between 10 and 100 characters'
          },
          isString(value) {
            if (typeof value !== 'string') {
              throw new Error('Email must be a string!');
            }
          }
        }
      },
      password: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeValidate: (user, options) => {
          if (typeof user.email === 'string') {
            user.email = user.email?.toLowerCase().trim();
          }
        },
        beforeCreate: async (user, options) => {
          const password = await bcrypt.hash(user.password, 10)
          user.password = password;
        },
      },
      sequelize,
      modelName: 'User',
      tableName: 'user',
      timestamps: true,
      updatedAt: false,
    }
  );
  return User;
};