const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt'); //암호화

const User = require('../models/user');

module.exports = () => {
    passport.use(new localStrategy({
        usernameField : 'member_id', //req.body.member_id
        passwordField : 'member_password', //req.body.member_password
    }, async (member_id, member_password, done) => {
        try {
            const exUser = await User.findOne({where : {member_id}});
            if (exUser){ //이미 회원일 경우
                const result = await bcrypt.compare(member_password, exUser.member_password);
                if (result) {
                    done(null,exUser);//done(서버에러,로그인 성공여부)
                } else{
                    done(null, false, { message : '비밀번호가 일치하지 않습니다'});
                }
            } else {
                done(null, false, {message : '가입되지 않은 회원입니다.'})
            };
        } catch(error){
            console.error(error);
            done(error);
        }
    }));
};