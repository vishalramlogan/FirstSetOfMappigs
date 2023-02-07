const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create users Schema
const UsersSchema = new Schema({
    username: {
        type: String,
        //trim: true,
        minlength: 3,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 3
    },
    passwordConfirmation: {
        type: String,
        required: [false],
        minlength: 3
    },
    securityQuestion: {
        type: String,
        required: [true, 'Secrity question is required']
    },
    securityQuestionAnswer: {
        type: String,
        required: [true, 'Secrity question answer is required']
    }
});

const Users = mongoose.model('user', UsersSchema); // passing the name of the collecton in database
module.exports = Users;