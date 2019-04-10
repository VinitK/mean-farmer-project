const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.userSignup = (req, res, next) => {
    bcrypt.hash(req.body.userPassword, 10)
    .then(hash => {
        const user = new User({
            userName: req.body.userName,
            userCountry: req.body.userCountry,
            userLanguage: req.body.userLanguage,
            userEmail: req.body.userEmail,
            userPassword: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: "User added successfully to India",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Invalid Authentication Credentials!"
            });
        });
    });
}

exports.userLogin = (req, res, next) => {
    
    let fetchedUser;
    
    User.findOne({ userEmail: req.body.userEmail })
    .then(user => {
        fetchedUser = user;
        if (!fetchedUser) {
            return res.status(401).json({
                message: "Authentication Failed!"
            })
        }
        return bcrypt.compare(req.body.userPassword, fetchedUser.userPassword)
    })
    .then(result => {
        if (!result) {
            return res.status(401).json({
                message: "Authentication Failed!"
            });
        }
        const token = jwt.sign(
            { userEmail: fetchedUser.userEmail, userId: fetchedUser._id }, 
            process.env.JWT_KEY, 
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: "Invalid Authentication Credentials!"
        });
    });
}