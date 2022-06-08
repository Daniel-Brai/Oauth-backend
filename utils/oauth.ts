// dependencies
import passport from "passport" 
import { config } from 'dotenv'
import User from '../model/User'
import { IMongoDBUser } from "types/types";
import { Error } from "mongoose";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

// read environment variavbles
config({path: './.env'})


export function googleAuth() { 
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
    function(_: any, __: any, profile: any, cb: any) {
      // called on successful authentication
      // Insert a user into database
      // checks if the user already exists if not create one
      User.findOne({ googleId: profile.id }, async(err: Error, doc: IMongoDBUser) => { 
        if (err) { 
          return cb(err, null)
        }

        if (!doc) { 
          // create a doc
          const newUser = new User({
            googleId: profile.id, 
            username: profile.name.givenName
          })

          await newUser.save()

          cb(null, newUser)
        }
        cb(null, doc)
      })
      
    }
  ));
}

export function githubAuth() {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
    function(_: any, __: any, profile: any, cb: any) {
      // called on successful authentication
      // Insert a user into database
      // checks if the user already exists if not create one
      User.findOne({ githubId: profile.id }, async(err: Error, doc: IMongoDBUser) => { 
        if (err) { 
          return cb(err, null)
        }

        if (!doc) { 
          // create a doc
          const newUser = new User({
            githubId: profile.id, 
            username: profile.username
          })

          await newUser.save()

          cb(null, newUser)
        }
        cb(null, doc)
      })
      
    }
  ));
}
