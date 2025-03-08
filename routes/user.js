const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const session = require("express-session");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const cookieParser = require("cookie-parser");

router.use(express.json());
router.use(cookieParser());
// router.use(session({
//     secret: "sessionsecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {secure : true}
// }))

async function hashPassword(password){
    try{
       const salt = await bcrypt.genSalt(10);
       const hash = await bcrypt.hash(password, salt);
       return hash;
    } catch(error){
          return new Error(error);
    }
}

async function generateToken(req){
   const accessToken = await jwt.sign({email: req.body.email}, process.env.SECRET_KEY , {expiresIn : 60 * 60});
   global.accessToken = accessToken;
   return accessToken;
//    next();
}

router.post("/register", async (req, res, next) => {
    try {
        const requestBody = req.body;
        console.log(requestBody);
        const hashedPassword = await hashPassword(requestBody.password);
        console.log(hashedPassword);
        delete requestBody.password;
        const user = new User({ ...requestBody, hashedPassword: hashedPassword });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (err) {
        res.status(err.status || 500).jsonp(err);
    }
});

router.post("/login", async (req, res, next)=> {
    try{
       const user = await User.find({email : req.body.email});
       console.log(user[0]);
       if(user){
          bcrypt.compare(req.body.password, user[0].hashedPassword, (err, response)=>{
            if(err){
                  console.log(response);
                  res.status(500).json(err);
            }
            else if(response){
                const token = generateToken(req);
                 token.then(tok => {
                    res.cookie("token", tok, {
                        httpOnly: true, // prevents XSS attacks
                        secure: true,
                        sameSite: "Strict" //prevents csrf
                    });
                    res.status(200).json({token: tok, status:200});
                 }).catch(err => {
                   res.status(403).send("Invalid token");
                 })
              } else{
                res.status(400).send("Invalid Credentials");
              }
          });
       } else {
        res.status(200).send("User doesn't exist");
       }
    } catch(error){
       res.status(error.status || 500).json(error);
    }
})

module.exports = router;