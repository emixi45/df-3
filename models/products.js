const mongoose = require('mongoose')

module.exports = mongoose.model('products', new mongoose.Schema(
    {
        name: {type: String, required:true},
        img: {type: String, required:true},
        description: {type: String, required:true},
        price: {type: Number, required:true}
    },
    {
        timestamps: true,
        versionKey: false
    }
))