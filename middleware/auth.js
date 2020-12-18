const { User } = require("../models/User");
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

    //인증처리를 하는곳
    //쿠키에서 토큰을 가져옴
    const token = req.cookies.x_auth;

    //user 인식 문제로 findByToken 매서드를 만들지 않고 여기서 직접 인증함.
    //토큰을 decode 한다
    jwt.verify(token, "secretToken", (err, decoded) => {

    if (err) throw err;

        //userid를 이용하여 유저를 찾은 후
        //클라이언트언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        User.findOne({ _id: decoded, token: token }, (err, user) => {
        if (err) return res.json({ success: false, err });
        if (!user) return res.json({ isAuth: false, error: true });
        req.token = token;
        req.user = user;

        next();
        });
    });
}

//다른 폴더에서 쓸수있게 만듬
module.exports = {auth};