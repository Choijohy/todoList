const Sequelize = require('sequelize');

// 일정 카테고리(종류)
module.exports = class Category extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            tag : {
                type : Sequelize.STRING(10),
                allowNull : false,
                unique : true,
            }
        },{
            sequelize,
            timestamps : false,
            underscored : false,
            paranoid : true,
            modelName :  'Category',
            tableName :  'category',
            charset :  'utf8',
            collate : 'utf8_general_ci',
        });
    }
    static associate(db){ //Todo:Category = N:1
        db.Category.hasMany(db.Todo , {foreignKey : 'category' , sourceKey : 'tag' });
    }
}