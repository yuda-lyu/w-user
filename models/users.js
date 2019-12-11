/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		'id': {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			autoIncrement: false,
			comment: null
		},
		'name': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'pwEnc': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'email': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'address': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'phone': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'organization': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'position': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'role': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'checkCode': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'token': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'tokenExp': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'timeCreate': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'timeLogin': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'remark': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		},
		'active': {
			type: DataTypes.STRING,
			allowNull: true,
			autoIncrement: false,
			comment: null
		}
	}, {
		tableName: 'users'
	});
};
