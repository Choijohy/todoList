const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            member_id : {
                type : Sequelize.STRING(30),
                allowNull : true,
                unique : true,
            },
            member_password : {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            nickname : {
                type : Sequelize.STRING(10),
                allowNull : false, 
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
        }, {
                sequelize,
                timestamps : true,
                underscored : true,
                paranoid :  true,
                modelName :  'User',
                tableName :  'user',
                charset :  'utf8',
                collate : 'utf8_general_ci',
        });
        
    }
    static associate(db){   //User:Todo = 1:N
        db.User.hasMany(db.Todo, {foreignKey: 'writer', sourceKey: 'id'});
    }
}