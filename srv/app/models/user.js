module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('User', {
		username: { type: DataTypes.STRING, allowNull: false },
		password: { type: DataTypes.STRING, allowNull: false },
		email: DataTypes.STRING
	}, {
		tableName: 'users',
		classMethods: {
			associate: function(models) {
				User.hasMany(models.Challenge, {through: models.Participating});
			}
		}
	});

	return User;
};
