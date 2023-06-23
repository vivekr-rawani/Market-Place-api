import mongoose from "mongoose"

const postSchema = mongoose.Schema({
    message : String,
    creator : String,
    tags : [String],
    selectedFile : String,
    title: String,
    likeCount : {
        type : Number,
        default : 0
    },
    createdAt : {
        type : Date,
        default : new Date()
    }
})

const PostMessage = mongoose.model('PostMessage', postSchema)

export default PostMessage
//we can create a document in mongodb, to have uniformity in data