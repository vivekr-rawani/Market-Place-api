import mongoose from "mongoose";

const commentScema = mongoose.Schema({
    parent: { type: mongoose.Types.ObjectId },
    comment: { type: String, required: true },
    

});

export default mongoose.model("Comments", commentScema);