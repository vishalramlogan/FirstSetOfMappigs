const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const users = require('../controllers/users');

// Display list of users from database
router.get('/users/:username',authUser,users.allUsers );

/*
// Display a user from database
router.get('/user/:username',authUser,function(req,res){
    Users.find({username: req.params.username}).then(function(user){
        res.send(user);
    }).catch((error) => console.log(error));
});
*/

//Add a user to the database
router.post('/signup',users.signUp);

// Update a password for a user
router.put('/users',users.updatePassword);
router.get('/users',users.updatePasswordSQ);

// Login 
router.post('/login',users.login);

//Delete a user and all info from database by username
router.delete('/users/:admin',authUser,users.deleteUser);

//Get all of a users's info from all mappings
router.get('/usersinfo',users.allOfAUser);

module.exports = router;