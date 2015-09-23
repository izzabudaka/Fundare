module.exports = function(sequelize, DataTypes) {
  var Wager = sequelize.define('Wager', {
    value: { type:DataTypes.DECIMAL(10,2), allowNull: false}
  }, {
    tableName: 'wagers',
    classMethods: {
      associate: function(models) {
        Wager.belongsTo(models.Challenge);
      }
    }
  });

  return Wager;
};
