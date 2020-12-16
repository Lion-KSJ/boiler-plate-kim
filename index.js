const express = require('express')
const app = express()
const port = 5000

const {User} = require("./models/User");
const bodyParser = require('body-parser');

const config = require("./config/key");
//application/x-www-form-rulencoded 분석해서 가지고옴
app.use(bodyParser.urlencoded({extended:true}));
//application/json 타입으로 된것을 분석해서 가지고옴
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected OK!!'))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('KST TEST => Hello World! ~~')
})

app.post('/register',(req,res) => {

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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})