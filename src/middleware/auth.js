const jwt = require('jsonwebtoken')
const Register = require('../../models/regesterd')

const auth = async (req, res, next) =>{
    try {
        const token = req.cookies.yash;
        console.log('the token of yash is ', token)
        const varifyuser =  jwt.verify(token, process.env.SECRET_KEY);
        console.log(varifyuser);

        const user = await Register.findOne({_id:varifyuser._id})
        // console.log(user.name)

        req.token = token;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth;