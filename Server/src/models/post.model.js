import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    tags: {
        type: [String],
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: {
        type: String
    },
    rewards: {
        type: Number,
        default: 0
    },
    label: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const Post = mongoose.model('Post', postSchema);

export default Post;