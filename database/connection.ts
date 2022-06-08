//  Dependencies
import { connect } from "mongoose";
import { config } from "dotenv"

// read environment variavbles
config({path: './.env'})

// connect to database function
export const connectDB = async() => { 
    await connect(
        ( process.env.MONGO_URI || 'mongodb://localhost:27017/oauth' )
    ).then(() => { 
        console.log(`💾 [database]: Database connection established....`)
    }).catch((err) => { 
        console.log(`😥[database]: Database connection failed....`)
        console.log(`An error occured: ${err.message}`)
    })
}
