'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_log = sequelize.define('tbl_log', {
    nomor: DataTypes.STRING
  }, {});
  tbl_log.associate = function(models) {
    // associations can be defined here
  };
  return tbl_log;
};