const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postDate: {
        type: Date,
        required: true,
        default: Date.now()
    }   
})

module.exports = mongoose.model('Items', itemSchema);