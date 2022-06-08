"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
