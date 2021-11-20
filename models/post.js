const mongoose = require("mongoose");

// DB Schema
const postSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true
    },
    info: {
        type:String,
        max:500
    },
    likes: {
        type: Array,
        default: []
    },
    image: {
        type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
