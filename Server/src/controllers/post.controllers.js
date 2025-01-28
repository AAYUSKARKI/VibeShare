import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import Post from "../models/post.model.js"; // Import the Post model
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assuming you have a utility for uploading images
import { Apiresponse } from "../utils/apiresponse.js";

// Create a new post
const createPost = asynchandler(async (req, res) => {
    const { content, imageUrl, sentiment, likes, dislikes, comments } = req.body;

    // Validate required fields
    if (!content || !sentiment) {
        throw new Apierror(400, "Content and sentiment are required");
    }

    // If an image is provided, upload it to Cloudinary
    let uploadedImageUrl = imageUrl;
    if (req.files && req.files.image) {
        const imageLocalPath = req.files.image[0].path;
        uploadedImageUrl = await uploadOnCloudinary(imageLocalPath);
        if (!uploadedImageUrl) {
            throw new Apierror(400, "Image upload failed");
        }
    }

    // Create a new post
    const newPost = await Post.create({
        author: req.user._id, // Set author to the authenticated user's ID
        content,
        imageUrl: uploadedImageUrl,
        sentiment,
        likes: likes || 0,
        dislikes: dislikes || 0,
        comments: comments || 0
    });

    return res.status(201).json(new Apiresponse(200, newPost, "Post created successfully"));
});

// Get all posts
const getAllPosts = asynchandler(async (req, res) => {
    const posts = await Post.find().populate('author', 'username'); // Populate author if you have a User model
    return res.status(200).json(new Apiresponse(200, posts, "Posts retrieved successfully"));
});

// Get a single post by ID
const getPostById = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
        throw new Apierror(404, "Post not found");
    }
    return res.status(200).json(new Apiresponse(200, post, "Post retrieved successfully"));
});

// Update a post
const updatePost = asynchandler(async (req, res) => {
    const { content, imageUrl, sentiment, likes, dislikes, comments } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
        throw new Apierror(404, "Post not found");
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
        throw new Apierror(403, "You are not authorized to update this post");
    }

    // Update fields
    post.content = content || post.content;
    post.imageUrl = imageUrl || post.imageUrl;
    post.sentiment = sentiment || post.sentiment;
    post.likes = likes !== undefined ? likes : post.likes;
    post.dislikes = dislikes !== undefined ? dislikes : post.dislikes;
    post.comments = comments !== undefined ? comments : post.comments;

    await post.save();

    return res.status(200).json(new Apiresponse(200, post, "Post updated successfully"));
});

// Delete a post
const deletePost = asynchandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        throw new Apierror(404, "Post not found");
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
        throw new Apierror(403, "You are not authorized to delete this post");
    }

    await post.remove();

    return res.status(200).json(new Apiresponse(200, null, "Post deleted successfully"));
});

export { createPost, getAllPosts, getPostById, updatePost, deletePost };