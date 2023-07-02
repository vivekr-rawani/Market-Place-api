import mongoose from "mongoose"

const postSchema = mongoose.Schema({
    message: String,
    creator: String,
    name : String,
    userProfilePicture :String,
    tags: [String],
    selectedFile: String,
    title: String,
    likes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
},
    { timestamps: true })

const PostMessage = mongoose.model('PostMessage', postSchema)

export default PostMessage
//we can create a document in mongodb, to have uniformity in data