const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Todo } = require('../models');
const router = express.Router();

router.post('/', isLoggedIn , async(req, res, next) => {
    try{
        const update = await Todo.update({
            content :  req.body.content,
            category : req.body.category,
            dueDate : req.body.dueDate,
        },{
        where : {
            id : req.query.id,
        }});
        res.redirect(`/read?date=${req.body.dueDate}`)
    }
    catch(error){
        console.error(error);
        next(error);
    }
});

module.exports = router;