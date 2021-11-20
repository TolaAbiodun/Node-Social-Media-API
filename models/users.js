const mongoose = require('mongoose');

// DB Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min:5,
        max:25,
        required: true,
        unique:true
    },
    email: {
        type: String,
        max:50,
        required: true,
        unique:true
    },
    password: {
        type: String,
        min: 7,
        required: true    
    },
    profileImage: {
        type: String,
        default: ""
    },
    coverImage: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    bio: {
        type: String,
        max: 60,
  },
    city: {
        type: String,
        max: 25,
    },
    from: {
        type: String,
        max: 25,
    },
    rel_status: {
        type: Number,
        status: [1, 2, 3],
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },
},
    {timestamps: true}
);

module.exports = mongoose.model('user', userSchema);