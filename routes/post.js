const express = require('express');
const path = require('path');
const fs = require('fs');


const { Todo } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next)=>{
        try{
            const post = await Todo.create({
                content :  req.body.content,
                category : req.body.category,
                writer :  req.user.id,
                dueDate : req.body.dueDate,
            });
            res.redirect('/');
        }catch(error){
            console.error(error);
            next(error);

        }
});

module.exports = router;