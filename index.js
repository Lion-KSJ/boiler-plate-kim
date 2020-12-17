const express = require('express')
const app = express()
const port = 5000

const {auth} = require("./middleware/auth");
const {User} = require("./models/User");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 

const config = require("./config/key");
//application/x-www-form-rulencoded 분석해서 가지고옴
app.use(bodyParser.urlencoded({extended:true}));
//application/json 타입으로 된것을 분석해서 가지고옴
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected OK!!'))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('KST TEST => Hello World! ~~')
})

app.post('/api/users/register',(req,res) => {

    //회원가입할때 필요한 정보들을 client에서 가져오면
    // 그것들을 DB에 넣어준다
    const user = new User(req.body)

    console.log('====================================');
    console.log("user : ", user);
    console.log('====================================');

    user.save((err)=> {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.post('/api/users/login',(req,res) => {
    //요청된 email 을 db에서 찾는다
    User.findOne({ email: req.body.email }, (err, user) =>{
        if(!user)
        {
            return res.json({
                loginSuccess: false,
                message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //비밀번호 일치 여부 확인
        user.comparePassword(req.body.password , (err,isMatch) =>{
            if(!isMatch) 
            return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})

            //비밀번호가 동일하다면 유저 토큰 생성하기
            user.generateToken((err, user) =>{
                if(err) return res.status(400).send(err);

                //토큰을 원하는 위치에 저장한다. -> 쿠키? local? 세션?
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess:true, userId: user._id})
            })            
        })
    })

})

app.get('/api/users/auth', auth, (req,res) =>{
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 ture라는말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0? false : true,
        isAuth:true,
        email :req.user.email,
        name: req.user.name,
        lastname:req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

})

app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    const id_test = req.userInfo._id;
    const id_test1 = req.user._id;

    console.log("test-> ",id_test);
    console.log("test1 ->",id_test1);

    User.findOneAndUpdate({ _id: req.userInfo._id },
      { token: "" }
      , (err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
          success: true
        })
      })
  })

// app.get('/api/users/logout', auth, (req, res) => {
//     console.log('index.js====================================');
//     console.log("auth : ", auth);
//     console.log("user : ", req.user);
//     console.log("user_ID: ", req.user._id);
//     console.log('====================================');   
//     User.findOneAndUpdate({ _id: req.uesr._id },
//         { token: "" }
//         ,(err, user)=>{
//             if(err) return res.json({success: false, err});
//             return res.status(200).send({
//                 success:true
//             })
//         })
//     })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})