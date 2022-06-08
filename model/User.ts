// Dependencies
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ 
    googleId: {
        type: String,
        required: false
    },
    githubId: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userSchema)

export default User