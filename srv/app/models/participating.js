module.exports = function(sequelize, DataTypes) {
  var Participating = sequelize.define('Participating', {
    score: {type:DataTypes.INTEGER, allowNull: true, defaultValue: 0},
    updated: {type:DataTypes.BOOLEAN, allowNull:false, defaultValue:false}
  })
  return Participating;
}