const express = require('express');
const path = require('path');
const fs = require('fs');
const csrf = require('csurf');
const csrfProtection = csrf({cookie: true});
const sanitizeHTML = require('sanitize-html');



const { Todo } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', csrfProtection ,isLoggedIn, async (req, res, next)=>{
        try{
            const filtered = sanitizeHTML(req.body.content);
            req.filtered = filtered;
            
            const post = await Todo.create({
                content :  req.filtered,
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