import mongoose from 'mongoose';

const sentimentSchema = new mongoose.Schema({
    positive: {
        type: Number,
        required: true,
        default: 0
    },
    negative: {
        type: Number,
        required: true,
        default: 0
    },
    neutral: {
        type: Number,
        required: true,
        default: 0
    }
}, { _id: false }); // Prevents creating an _id for the sentiment subdocument

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    sentiment: {
        type: sentimentSchema,
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
        type: Number,
        default: 0
    },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const Post = mongoose.model('Post', postSchema);

export default Post;