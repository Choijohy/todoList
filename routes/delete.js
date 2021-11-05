const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Todo } = require('../models');
const router = express.Router();

router.get('/:id', isLoggedIn, async(req, res, next) => {
    try{
        const {id} = req.params;
        const deleteContent = await Todo.destroy({
            where : {id}
        });
        res.redirect('/');
     } catch(error){
        console.error(error);
        next(error);
    };
});

module.exports = router;