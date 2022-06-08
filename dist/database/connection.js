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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
//  Dependencies
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
// read environment variavbles
(0, dotenv_1.config)({ path: './.env' });
// connect to database function
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)((process.env.MONGO_URI || 'mongodb://localhost:27017/oauth')).then(() => {
        console.log(`💾 [database]: Database connection established....`);
    }).catch((err) => {
        console.log(`😥[database]: Database connection failed....`);
        console.log(`An error occured: ${err.message}`);
    });
});
exports.connectDB = connectDB;
