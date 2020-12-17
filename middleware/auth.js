const { User } = require("../models/User");

let auth = (req, res, next) =>{
    //인증처리를 하는곳
    //쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 후 유저를 찾는다
    User.findByToken(token, (err, userInfo) => {
        if(err) throw err;    
        if(!userInfo) return res.json({ isAuth:false, error:true});
        
        req.token=token;
        req.user=userInfo;

        console.log("auth.js-------------");
        console.log("token -> ", token);
        console.log("user -> ", userInfo);
        console.log("auth.js-------------");
        
        next();
    })

    

    //유저가 있으면 인증 완료

    //유저가 없으면 인증 실패

}

//다른 폴더에서 쓸수있게 만듬
module.exports = {auth};