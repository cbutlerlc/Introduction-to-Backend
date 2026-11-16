import { Post } from '../models/post.model.js';

//create a  post
const createPost = async (req, res) => {
    try {
        const { title, description,  createdBy } = req.body;

        if (!title || !description || !createdBy) {
            return res.status(400).json({ message: 'Title, description, and createdBy are required' });
        }
        const post = await Post.create({
            title,
            description,
           createdBy
        });
        return res.status(201).json({
            message: "post created successfully", post
        });
    
    } catch (error) {
    return res.status(500).json({
        message: "Internal Server error", error
    });
}
}
// Read all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("createdBy", "username email");
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server error", error
        });
    }
}

const updatePost = async (req, res) => {
    try {
        //basic validation to check if the body is empty
        if(Object.keys(req.body).length === 0){
            return res.status(400).json({ message: 'Request body is empty' });
        }
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
         
        return res.status(200).json({
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server error",
            error
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({
            message: "Post deleted successfully",
            deleted
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server error",
            error
        });
    }
};
export {
    createPost,
    getPosts,
    updatePost,
    deletePost
};