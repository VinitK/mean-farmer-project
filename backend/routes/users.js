const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

router.post("/signup", userController.userSignup);

router.post("/login", userController.userLogin);

// router.put("/:id", (req, res, next) => {

//     const user = new User({
//         _id: req.body.id,
//         userEmail: req.body.userEmail,
//         userPassword: req.body.userPassword
//     });

//     User.updateOne({_id: req.params.id}, user)
//     .then(result => {
//         res.status(200).json({ message: "Update Successful!" });
//     });
// });

// router.get('/', (req, res, next) => {
    
//     const pageSize = +req.query.pagesize;
//     const currentPage = +req.query.page;
//     const userQuery = User.find();
//     let fetchedUsers;
    
//     if(pageSize && currentPage) {
//         userQuery
//         .skip(pageSize * (currentPage - 1))
//         .limit(pageSize);
//     }
    
//     userQuery
//     .then(documents => {
//         fetchedUsers = documents
//         return User.count();
//     })
//     .then(count => {
//         res.status(200).json({ 
//             message:"Users fetched successfully.", 
//             users:fetchedUsers,
//             maxUsers: count 
//         });
//     });
// });

// router.get('/:id', (req, res, next) => {
    
//     User.findById(req.params.id)
//     .then(user => {
//         if (user) {
//             res.status(200).json(user);
//         } else {
//             res.status(404).json({ 
//                 message:"User not found.", 
//                 users:documents 
//             });
//         }
//     });
// });

// router.delete('/:id', (req, res, next) => {
//     User.deleteOne({ _id: req.params.id })
//     .then(result => {
//         res.status(200).json({ message: "User Deleted!" });
//     });
// });

module.exports = router;