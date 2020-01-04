'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_penerima = sequelize.define('tbl_penerima', {
    nama: DataTypes.STRING,
    nomor: DataTypes.STRING,
    kategori: DataTypes.STRING,
    tgl_lahir: DataTypes.DATE,
    tempat_lahir: DataTypes.STRING
  }, {});
  tbl_penerima.associate = function(models) {
    // associations can be defined here
  };
  return tbl_penerima;
};