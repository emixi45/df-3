const mongoose = require('mongoose')

module.exports = mongoose.model('users', new mongoose.Schema(
    {
        username: {type: String, required:true},
        img: {type: String, required:true},
        email: {type: String, required:true},
        password: {type: String, required:true},
        adress: {type: String, required:true},
        age: {type: Number, required:true},
        phone: {type: Number, required:true},
        cart: [Object]
    },
    {
        timestamps: true,
        versionKey: false
    }
))