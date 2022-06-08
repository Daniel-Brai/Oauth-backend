//  import dependencies
import express, { Express, Request, Response, NextFunction } from 'express';
import { connectDB } from './database/connection'
import { config } from "dotenv"
import passport from "passport"
import cors from 'cors';
import session from 'express-session'
import { githubAuth, googleAuth } from './utils/oauth'
import User from './model/User';
import { IMongoDBUser } from './types/types';


// read environment variables
config({path: './.env'})

// initializing our express app
const app: Express = express();

// connect to Database
connectDB()

//options for cors midddleware
const options: cors.CorsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: ( process.env.HOSTED_CLIENT_URI ||'http://localhost:3000' ),
    preflightContinue: false,
};

// app middlewares
app.use(express.json())
app.use(cors(options))
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY || 'John is a cat Man'  , 
        resave: true,
        saveUninitialized: true
    })
)
app.use(passport.initialize())
app.use(passport.session())

// serialize user
passport.serializeUser((user: any, done: any) => {
  return done(null, user._id)
})

// deserialize user 
passport.deserializeUser((id: string, done: any) => { 
  User.findById(id, (err: Error , doc: IMongoDBUser ) => { 
    // 
    return done(null, doc);
  })
})


// user routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.get('/getuser', (req: Request, res: Response) => { 
    res.send(req.user)
})

app.get('/auth/logout', (req: Request, res: Response, next: NextFunction) => {
  if (req.user) { 
    req.logout(function(err) {
      if (err) { 
        return next(err); }
      // res.redirect('/');
    })
    res.send('Done')
    // res.status(200).write(
    //   'Logout successful!', 'utf8', () => { 
    //     console.log('Logout successful!')
    //   }
    // )
  }
})


// google authenciation function
googleAuth()

// github routes

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect( process.env.HOSTED_CLIENT_URI || 'http://localhost:3000' );
});

// github authenciation function
githubAuth()

// github routes
app.get('/auth/github',
  passport.authenticate('github')
);

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect( process.env.HOSTED_CLIENT_URI || 'http://localhost:3000' );
  }
);

// Server setup
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at port ${port}....`);
})