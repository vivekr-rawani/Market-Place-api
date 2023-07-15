import express from "express"
import {getPosts, getPost, getPostsBySearch, createPost, updatePost, deletePost, likePost, getUserPosts } from '../controller/posts.js'
import auth from "../middleware/auth.js"
const router = express.Router()

router.get('/search', getPostsBySearch);
router.get('/user', getUserPosts);
router.get('/', getPosts);
export const post = router.get('/:id', getPost);

router.post('/', auth, createPost)
router.patch('/:id', auth, updatePost)
router.delete('/:id', auth, deletePost)
router.patch('/:id/likePost', auth, likePost)



export default router