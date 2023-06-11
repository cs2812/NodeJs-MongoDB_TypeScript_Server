"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
});
exports.UserModel = (0, mongoose_1.model)("user", userSchema);
