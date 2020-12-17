const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    // _id:{
    //     type:String
    // },
    name:{
        type:String,
        maxlength:50
    },
    password:{
        type:String,
        maxlength:60
    },
    age:{
        type:Number
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    image: String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

userSchema.pre('save', function( next ){
    
    var user = this;

    if(user.isModified('password'))
    {
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt)
        {
            if(err) return next(err)
    
            bcrypt.hash(user.password , salt, function(err,hash)
            {
                console.log("before password : ", user.password);
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }
    else
    {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb)
{
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    //jsonwebtoken를 이용해서 token 생성하기
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null, user);
    })

}

userSchema.statics.findByToken = function(token, cb) {

    var user = this;
    var userInfo = this;
   
    //토큰을 decode 한다
    jwt.verify(token,'secretToken',function(err, decoded){

        //userid를 이용하여 유저를 찾은 후
        //클라이언트언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        userInfo.findOne({" _id" : decoded, "token": token}, function(err,user){
            
        // console.log("User.js-------------");
        // console.log("token-> ", token);
        // console.log("user-> ", decoded);
        console.log("user-> ", user);
        console.log("userInfo-> ", userInfo);
        console.log("User.js-------------");

            if(err) return cb(err);
            cb(null, userInfo);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }