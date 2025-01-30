import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import Post from "../models/post.model.js"; // Import the Post model
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Assuming you have a utility for uploading images
import { Apiresponse } from "../utils/apiresponse.js";
import { io } from "../index.js";
import { User } from "../models/user.model.js";
// Create a new post
const createPost = asynchandler(async (req, res) => {
    const { content,tags, label, score } = req.body;

    // Validate required fields
    if (!content || !label || !score) {
        throw new Apierror(400, "Content and sentiment are required");
    }

// Parse tags if they are provided
let validatedTags = [];
if (tags) {
    try {
        const parsedTags = JSON.parse(tags);
        if (Array.isArray(parsedTags)) {
            validatedTags = parsedTags.map(tag => tag.trim()).filter(tag => tag); // Trim and filter out empty tags
        } else {
            throw new Apierror(400, "Tags must be an array");
        }
    } catch (error) {
        throw new Apierror(400, "Invalid tags format");
    }
}

    let uploadedImageUrl = null;
    if (req.file) {
        const imageLocalPath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);
        
        // Check if the image upload was successful
        if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
            throw new Apierror(400, "Image upload failed");
        }

          // Store the secure URL from Cloudinary
          uploadedImageUrl = cloudinaryResponse.secure_url;

    } else {
        // If no file is uploaded, ensure uploadedImageUrl is set to an empty string
        uploadedImageUrl = "";
    }

    // Calculate rewards based on the score
    let rewards = 0;
    if (score > 0) {
        rewards = score * 100; // Example: score of 1 gives 100 rewards
    }

    // Update user token balance in a single operation
    const userUpdateResult = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { tokenBalance: rewards } }, // Increment tokenBalance by rewards
        { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!userUpdateResult) {
        throw new Apierror(404, "User  not found");
    }
    // Create a new post
    const newPost = await Post.create({
        author: req.user._id, // Set author to the authenticated user's ID
        content,
        imageUrl: uploadedImageUrl,
        tags: validatedTags,
        label,
        score,
        rewards
    });

    // Populate the author field
    const populatedPost = await Post.findById(newPost._id).populate('author', 'username');

    // Emit the new post to clients
    io.emit("newPost", populatedPost);

    return res.status(201).json(new Apiresponse(200, newPost, "Post created successfully"));
});

// Get all posts
const getAllPosts = asynchandler(async (req, res) => {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 }); // Populate author if you have a User model
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
    const post = await Post.findById(req.params.id);
    if (!post) {
        throw new Apierror(404, "Post not found");
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
        throw new Apierror(403, "You are not authorized to update this post");
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.status(200).json(new Apiresponse(200, updatedPost, "Post updated successfully"));
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