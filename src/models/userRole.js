'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      // define association here
      // this.belongsTo(User, {foreignKey: 'role_id', as :'user_role'})
    }
  }
  UserRole.init({
    role_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_role',
  });
  return UserRole;
};