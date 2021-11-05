const express = require('express');
const path = require('path');
const { isLoggedIn , isNotLoggedIn } = require('./middlewares')
const { User, Todo, Sequelize } = require('../models');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const { authenticate } = require('passport');

const router = express.Router();

router.use((req, res, next)=>{
    res.locals.user = req.user;
    next();
});

router.get('/',  async (req, res, next) => {
    try{
        if (req.isAuthenticated()){
            const dates = await Todo.findAll({
                where : {
                    writer : req.user.id
                }, attributes : [
                    'id',
                    [sequelize.fn('date_format', sequelize.col('dueDate'),'%Y%m%d'),'dueDate'],
                ]
                , order: [['createdAt']],
            });
            res.render('main', {
                title : 'list',
                dates : dates,
            });
        } else{
            res.render('main',{ title: 'list',});   
        };
    } catch(err){
        console.error(err);
        next(err);
    }
    
});



router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - TodoLIst' });
  });
  

  router.get('/read', isLoggedIn, async (req, res, next) => {
    try{
        const todos = await Todo.findAll({
            where: {
                [Op.and] : [
                    { writer : req.user.id },
                    { dueDate : req.query.date },
                ]},
                attributes : [
                    'id',
                    'content',
                    'category',
                    'accomplishment',
                    'writer',
                    'dueDate',
                ],
                order: [['createdAt']],
        });
        const dates = await Todo.findAll({
            where : {
                writer : req.user.id
            }, attributes : [
                'id',
                [sequelize.fn('date_format', sequelize.col('dueDate'),'%Y%m%d'),'dueDate'],
            ]
            , order: [['createdAt']],
        });
            res.render('main',{
                title: 'list',
                todos : todos,
                dates : dates,
            })

    } catch(err){
        console.error(err);
        next(err);
    }
    
});
module.exports = router;    