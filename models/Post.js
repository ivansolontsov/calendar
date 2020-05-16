const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dateSchema = new Schema({
    hour: {
        type: Number,
        require: true
    },
    date: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('posts', dateSchema);