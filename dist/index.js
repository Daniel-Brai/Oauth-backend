"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//  import dependencies
const express_1 = __importDefault(require("express"));
const connection_1 = require("./database/connection");
const dotenv_1 = require("dotenv");
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const oauth_1 = require("./utils/oauth");
const User_1 = __importDefault(require("./model/User"));
// read environment variables
(0, dotenv_1.config)({ path: './.env' });
// initializing our express app
const app = (0, express_1.default)();
// connect to Database
(0, connection_1.connectDB)();
//options for cors midddleware
const options = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: (process.env.HOSTED_CLIENT_URI || 'http://localhost:3000'),
    preflightContinue: false,
};
// app middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)(options));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET_KEY || 'John is a cat Man',
    resave: true,
    saveUninitialized: true
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// serialize user
passport_1.default.serializeUser((user, done) => {
    return done(null, user._id);
});
// deserialize user 
passport_1.default.deserializeUser((id, done) => {
    User_1.default.findById(id, (err, doc) => {
        // 
        return done(null, doc);
    });
});
// user routes
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/getuser', (req, res) => {
    res.send(req.user);
});
app.get('/auth/logout', (req, res, next) => {
    if (req.user) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            // res.redirect('/');
        });
        res.send('Done');
        // res.status(200).write(
        //   'Logout successful!', 'utf8', () => { 
        //     console.log('Logout successful!')
        //   }
        // )
    }
});
// google authenciation function
(0, oauth_1.googleAuth)();
// github routes
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.HOSTED_CLIENT_URI || 'http://localhost:3000');
});
// github authenciation function
(0, oauth_1.githubAuth)();
// github routes
app.get('/auth/github', passport_1.default.authenticate('github'));
app.get('/auth/github/callback', passport_1.default.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(process.env.HOSTED_CLIENT_URI || 'http://localhost:3000');
});
// Server setup
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`⚡️ [server]: Server is running at port ${port}....`);
});
