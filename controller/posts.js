import  Mongoose  from 'mongoose'
import PostMessage from '../models/postMessage.js'


export const getPosts = async (req, res)=>{
    try {
        const messages = await PostMessage.find()

        res.status(200).json(messages)
    }
    catch(error) {
        res.status(400).json({message : 'error'})
    }
    
}
export const createPost = async(req, res) => {
    const post = req.body
    const newPost = new PostMessage(post)
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
    
    
    if(!Mongoose.Types.ObjectId.isValid(id)) res.status(404).send("No post with given id")
    const post = await PostMessage.findById(id)

    const updatedPost = await PostMessage.findByIdAndUpdate(id, {likeCount : post.likeCount+1}, {new : true})
    res.send(updatedPost)
}