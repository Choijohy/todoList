const express = require('express'); 
const nunjucks = require('nunjucks');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');

// 다른 명령어들보다 최대한 위에 -> config되어야 process.env 적용가능
dotenv.config(); 

//Routers
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const deleteRouter = require('./routes/delete');
const updateRouter = require('./routes/update');


const { sequelize } = require('./models')
const passportConfig = require('./passport');

const app =  express();

//개발용 port와 배포용 port 구분
app.set('port', process.env.PORT || 8001);


//템플릿 엔진 설정 - nunjucks
app.set('view engine', 'html');
nunjucks.configure('views',{
    express: app,
    watch: true,
});

//connect mysql
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });


passportConfig();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret : process.env.COOKIE_SECRET,
    cookie: {
        httpOnly : true,
        secure : false,
    },

}));

//라우터 연결전 passport 미들웨어 연결
app.use(passport.initialize());
app.use(passport.session());


app.use('/',pageRouter);
app.use('/auth',authRouter);
app.use('/post',postRouter);
app.use('/delete',deleteRouter);
app.use('/update',updateRouter);

//404 ERROR
app.use((req, res, next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status = 404;
    next(error);
});

// 다른 app.use() 및 라우터 호출이 끝난 뒤에 오류처리 미들웨어 작성
app.use((err, req, res, next)=>{
    //템플릿 엔진에서 사용 가능한 변수'message'
    res.locals.message = err.message; 
    //템플릿 엔진에서 사용 가능한 변수 'error'
    res.locals.error = process.env.NODE_ENV !== 'production' ? err:{};
    res.status(err.status || 500).render('error');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기중');
});
