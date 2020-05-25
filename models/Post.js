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
    },
    name: {
        type: String,
        required: true
    },
    bandName: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true
    },
    bass: {
        type: Boolean,
        required: true
    },
    keys: {
        type: Boolean,
        required: true
    },
    cymbals: {
        type: Boolean,
        required: true
    },
    microphones: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('posts', dateSchema);