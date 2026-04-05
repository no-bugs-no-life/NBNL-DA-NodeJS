let jwt = require('jsonwebtoken')
let userController = require('../controllers/users')
module.exports = {
    checkLogin: async function (req, res, next) {
        let token
        if (req.cookies.token) {
            token = req.cookies.token
        } else {
            token = req.headers.authorization;
            if (!token || !token.startsWith("Bearer")) {
                res.status(401).send({ message: "ban chua dang nhap" })
                return;
            }
            token = token.split(' ')[1];
        }
        try {
            let result = jwt.verify(token, 'secret');
            req.userId = result.id;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).send({ message: "token da het han, vui long dang nhap lai" })
            } else {
                res.status(401).send({ message: "token khong hop le" })
            }
        }
    },
    checkRole: function (...requiredRole) {
        return async function (req, res, next) {
            let userId = req.userId;
            let user = await userController.FindUserById(userId);
            if (!user) {
                res.status(401).send({ message: "user khong ton tai" });
                return;
            }
            let currentRole = user.role && user.role.name;
            if (requiredRole.includes(currentRole)) {
                next();
            } else {
                res.status(403).send({ message: "ban khong co quyen" });
            }
        }
    }
}