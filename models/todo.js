const Sequelize = require('sequelize');

// 일정
module.exports = class Todo extends Sequelize.Model{
    static init(sequelize){
        return super.init({
          content : {
              type : Sequelize.STRING(150),
              allowNull : false,
          },
          accomplishment : {
              type : Sequelize.BOOLEAN,
              allowNull :  false,
              defaultValue : false,
          },
          dueDate : {
              type : Sequelize.DATEONLY,// date type without time
              allowNull : false,
          },
        }, {
            sequelize,
            timestamps : true,
            underscored : false,
            paranoid : true,
            modelName : 'Todo',
            tableName : 'todo',
            charset :  'utf8',
            collate : 'utf8_general_ci', 
        });
    }
    static associate(db){ // Todo:User = N:1 , Todo:Category = N:1
        db.Todo.belongsTo(db.User, {foreignKey : 'writer', targetKey: 'id'});
        db.Todo.belongsTo(db.Category, {foreignKey : 'category', targetKey : 'tag'});
    }
}