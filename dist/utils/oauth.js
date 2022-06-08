"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubAuth = exports.googleAuth = void 0;
// dependencies
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = require("dotenv");
const User_1 = __importDefault(require("../model/User"));
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
// read environment variavbles
(0, dotenv_1.config)({ path: './.env' });
function googleAuth() {
    passport_1.default.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    }, function (_, __, profile, cb) {
        // called on successful authentication
        // Insert a user into database
        // checks if the user already exists if not create one
        User_1.default.findOne({ googleId: profile.id }, (err, doc) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return cb(err, null);
            }
            if (!doc) {
                // create a doc
                const newUser = new User_1.default({
                    googleId: profile.id,
                    username: profile.name.givenName
                });
                yield newUser.save();
                cb(null, newUser);
            }
            cb(null, doc);
        }));
    }));
}
exports.googleAuth = googleAuth;
function githubAuth() {
    passport_1.default.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback"
    }, function (_, __, profile, cb) {
        // called on successful authentication
        // Insert a user into database
        // checks if the user already exists if not create one
        User_1.default.findOne({ githubId: profile.id }, (err, doc) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return cb(err, null);
            }
            if (!doc) {
                // create a doc
                const newUser = new User_1.default({
                    githubId: profile.id,
                    username: profile.username
                });
                yield newUser.save();
                cb(null, newUser);
            }
            cb(null, doc);
        }));
    }));
}
exports.githubAuth = githubAuth;
