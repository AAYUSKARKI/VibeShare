import { Router } from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} from "../controllers/post.controllers.js"; // Import the post controller functions
import { upload } from "../middleware/multer.middleware.js"; // Import the multer middleware for file uploads
import { verifyJWT } from "../middleware/auth.middleware.js"; // Import the JWT verification middleware

const router = Router();

// Route to create a new post
router.route("/posts").post(
    verifyJWT, // Ensure the user is authenticated
    upload.fields([
        {
            name: "image", // Field name for the post image
            maxCount: 1
        }
    ]),
    createPost
);

// Route to get all posts
router.route("/posts").get(getAllPosts);

// Route to get a single post by ID
router.route("/posts/:id").get(getPostById);

// Route to update a post
router.route("/posts/:id").patch(
    verifyJWT, // Ensure the user is authenticated
    upload.fields([
        {
            name: "image", // Field name for the post image
            maxCount: 1
        }
    ]),
    updatePost
);

// Route to delete a post
router.route("/posts/:id").delete(verifyJWT, deletePost);

export default router; // Export the router