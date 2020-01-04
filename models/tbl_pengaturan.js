'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_pengaturan = sequelize.define('tbl_pengaturan', {
    jeda: DataTypes.INTEGER,
    jumlah_server: DataTypes.INTEGER
  }, {});
  tbl_pengaturan.associate = function(models) {
    // associations can be defined here
  };
  return tbl_pengaturan;
};