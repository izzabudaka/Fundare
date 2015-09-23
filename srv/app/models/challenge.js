module.exports = function(sequelize, DataTypes) {
  var Challenge = sequelize.define('Challenge', {
    name: { type: DataTypes.STRING, allowNull: false },
    started: { type: DataTypes.BOOLEAN, allowNull: false },
    committed: { type: DataTypes.BOOLEAN, allowNull: false },
    expirationDate: { type: DataTypes.DATE, allowNull: false },
    cancelled: {type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false},
    charityName: {type: DataTypes.STRING, allowNull:false},
    charityCode: {type: DataTypes.STRING, allowNull:false}
  }, {
    tableName: 'challenges',
    classMethods: {
      associate: function(models) {
        Challenge.hasOne(models.Wager);
        Challenge.hasMany(models.User, {through: models.Participating});
      }
    }
  });

  return Challenge;
};
