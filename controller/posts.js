import  Mongoose  from 'mongoose'
import PostMessage from '../models/postMessage.js'


export const getPosts = async (req, res)=>{
    const {page} = req.query
    try {
        //console.log(page);
        const LIMIT = 4
        const startIndex = (Number(page) - 1) * LIMIT
        const totalPosts = await PostMessage.countDocuments({})
        
        const posts = await PostMessage.find().sort( {updatedAt : -1}).limit(LIMIT).skip(startIndex)

        res.status(200).json({posts, currentPage : Number(page), numberOfPages : Math.ceil(totalPosts/LIMIT) })
    }
    catch(error) {
        res.status(400).json({message : 'error'})
    }
    
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
        res.json( {data : posts} );
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        if(!Mongoose.Types.ObjectId.isValid(id)) res.status(404).send("No post with given id")
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async(req, res) => {
    const post = req.body
    
    const newPost = new PostMessage({...post, creator : req.userId})
    try {
        await newPost.save()

        res.status(200).json(newPost)
        
    } catch (error) {
        res.status(409).json(newPost)
    }
    
}

export const updatePost = async(req, res) => {
    const {id} = req.params
    const post = req.body
    // const { id : _id} = req.params -> we are renaming the key
    if(!Mongoose.Types.ObjectId.isValid(id)) res.status(404).send("No post with given id")

    const updatedPost = await PostMessage.findByIdAndUpdate(id, {...post, id}, {new : true})
    res.send(updatedPost)
}

export const deletePost = async(req, res) => {
    const {id} = req.params
    //const { id : _id} = req.params -> we are renaming the key

    // res.json({id : id})
    if(!Mongoose.Types.ObjectId.isValid(id)) res.status(404).send("No post with given id")

    await PostMessage.findByIdAndRemove(id)
   res.json({message : 'post deleted'})
}

export const likePost = async(req, res) => {
    const {id} = req.params

    if(!req.userId) return res.json({message : 'Unauthenticated!!'})
    
    
    if(!Mongoose.Types.ObjectId.isValid(id)) res.status(404).send("No post with given id")
    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex( (id) => id === String(req.userId))

    if(index === -1){
        post.likes.push(req.userId)
    }else {
           post.likes =  post.likes.filter( id => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new : true})
    res.send(updatedPost)
}