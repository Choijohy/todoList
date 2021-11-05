const Sequelize = require('sequelize');
const User = require('./user');
const Todo = require('./todo');
const Category = require('./category');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db =  {};

const sequelize = new Sequelize(config.database , config.username, config.password,config)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Todo = Todo;
db.Category = Category;


User.init(sequelize);
Todo.init(sequelize);
Category.init(sequelize);

User.associate(db);
Todo.associate(db);
Category.associate(db);


module.exports = db;
