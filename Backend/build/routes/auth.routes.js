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
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userRoute = express_1.default.Router();
exports.userRoute = userRoute;
// <-----Middleware to verify access token--------->
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //start with "Bearer"
    if (!token) {
        return res.status(401).json({ message: "Access token not provided" });
    }
    jsonwebtoken_1.default.verify(token, `${process.env.ACCESS_KEY}`, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid access token" });
        }
        next();
    });
};
//<---------------User signup-------------->
userRoute.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isUserExist = yield user_model_1.UserModel.findOne({ email });
        if (isUserExist) {
            return res.status(409).json({ message: "Email already exists" });
        }
        // encoding password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.UserModel({ email, password: hashedPassword });
        yield newUser.save();
        res.status(201).json({ message: "Signup successful", data: newUser });
    }
    catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
//<---------------User login-------------->
userRoute.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //finding user
        const user = yield user_model_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // decoding password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // access token
        const accessToken = jsonwebtoken_1.default.sign({ email: user.email }, `${process.env.ACCESS_KEY}`, {
            expiresIn: "120s",
        });
        // refresh token
        const refreshToken = jsonwebtoken_1.default.sign({ email: user.email }, `${process.env.REFRESH_KEY}`);
        res.json({ accessToken, refreshToken });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
//<---------------Request for refresh token-------------->
userRoute.post("/refresh-token", (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not provided" });
    }
    // Verifying refresh token
    jsonwebtoken_1.default.verify(refreshToken, `${process.env.REFRESH_KEY}`, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        //new access token
        const accessToken = jsonwebtoken_1.default.sign({ email: decoded.email }, `${process.env.ACCESS_KEY}`, {
            expiresIn: "120s",
        });
        res.json({ accessToken });
    });
});
//<---------------Get user profile-------------->
userRoute.get("/profile", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.email;
        // Finding user
        const user = yield user_model_1.UserModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ email: user.email }); // we can't send password
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
//<---------------Delete user Account-------------->
userRoute.delete("/delete-account", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve the user email from the request
        const userEmail = req.body.email;
        // Deleteing the user from mongoDB
        const result = yield user_model_1.UserModel.deleteOne({ email: userEmail });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
