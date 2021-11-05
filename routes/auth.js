const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const { isLoggedIn , isNotLoggedIn } = require('./middlewares');


const router =  express.Router();

router.post('/join', isNotLoggedIn, async(req, res, next)=> {
    const {member_id , nickname, member_password} = req.body;
    try {
        const exUser = await User.findOne({where: {member_id}});
        if (exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(member_password,12);
        await User.create({
            member_id,
            nickname,
            member_password : hash,
        });
        return res.redirect('/');
    } catch(error){
        console.error(error);
        return next(error);
    }
});

router.post('/login',isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError){
            console.error(authError);
            return next(error);
        }
        if (!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        }); 
    })(req, res, next); //미들웨어 확장  
});

router.get('/logout', isLoggedIn, (req, res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;