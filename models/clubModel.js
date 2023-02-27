const mongoose = require('mongoose');


const clubSchema = mongoose.Schema({
    clubName: {
        type: String,
        required: [true, "Please Enter Club Name"],
        trim: true
    },
    founded: {
        type: Date,
        required: [true, "Please Enter Year of Founded Date"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    logo: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }],


})


module.exports = mongoose.model("Club", clubSchema);