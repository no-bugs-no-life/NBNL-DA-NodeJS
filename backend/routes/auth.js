var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
let roleModel = require('../schemas/roles');
let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')
let { checkLogin } = require('../utils/authHandler.js')
let { changePasswordValidator, validateResult, resetPasswordValidator } = require('../utils/validatorHandler')
let crypto = require('crypto')
let mailHandler = require('../utils/sendMailHandler')

/* GET home page. */
//localhost:3000
router.post('/register',
    /* #swagger.tags = ['Auth'] */
 async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).send({ message: "username, password, email la bat buoc" });
        }

        // Tu dong lay hoac tao role USER
        let userRole = await roleModel.findOne({ name: 'USER', isDeleted: false });
        if (!userRole) {
            userRole = new roleModel({ name: 'USER', description: 'Nguoi dung thong thuong' });
            await userRole.save();
        }

        let newUser = await userController.CreateAnUser(username, password, email, userRole._id);
        res.status(201).send({ message: "Dang ki thanh cong", userId: newUser._id });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ message: "Username hoac email da ton tai" });
        }
        res.status(400).send({ message: error.message });
    }
});
router.post('/login',
    /* #swagger.tags = ['Auth'] */
 async function (req, res, next) {
    let result = await userController.QueryByUserNameAndPassword(
        req.body.username, req.body.password
    )
    if (result) {
        let token = jwt.sign({
            id: result.id
        }, 'secret', {
            expiresIn: '1h'
        })
        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        });
        res.send(token)
    } else {
        res.status(404).send({ message: "sai THONG TIN DANG NHAP" })
    }

});
router.get('/me',
    /* #swagger.tags = ['Auth'] */
 checkLogin, async function (req, res, next) {
    console.log(req.userId);
    let getUser = await userController.FindUserById(req.userId);
    res.send(getUser);
})
router.post('/logout',
    /* #swagger.tags = ['Auth'] */
 checkLogin, function (req, res, next) {
    res.cookie('token', null, {
        maxAge: 0,
        httpOnly: true
    })
    res.send("da logout ")
})
router.post('/changepassword',
    /* #swagger.tags = ['Auth'] */
 checkLogin, changePasswordValidator, validateResult, async function (req, res, next) {
    let { oldpassword, newpassword } = req.body;
    let user = await userController.FindUserById(req.userId);
    console.log(user);
    if (bcrypt.compareSync(oldpassword, user.password)) {
        user.password = newpassword;
        await user.save();
        res.send("password da duoc thay doi")
    } else {
        res.status(404).send("old password sai")
    }

})
router.post('/forgotpassword',
    /* #swagger.tags = ['Auth'] */
 async function (req, res, next) {
    let email = req.body.email;
    let user = await userController.FindUserByEmail(email);
    if (!user) {
        res.status(404).send({
            message: "email khong ton tai"
        })
        return;
    }
    user.forgotpasswordToken = crypto.randomBytes(21).toString('hex');
    user.forgotpasswordTokenExp = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    let URL = 'http://localhost:3000/api/v1/auth/resetpassword/'+ user.forgotpasswordToken;
    mailHandler.sendMail(user.email,URL);
    res.send("check mail")
})
router.post('/resetpassword/:token',
    /* #swagger.tags = ['Auth'] */
resetPasswordValidator,validateResult, async function (req, res, next) {
    let password = req.body.password;
    let token =req.params.token;
    let user = await userController.FindUserByToken(token);
    if(!user){
        res.status(404).send("token reset password sai");
        return;
    }
    user.password = password;
    user.forgotpasswordToken = null;
    user.forgotpasswordTokenExp = null;
    await user.save()
    res.send("update password thanh cong")
})


module.exports = router;