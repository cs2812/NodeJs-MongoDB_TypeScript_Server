import express from "express";
import mongoose from "mongoose";
import { userRoute } from "../routes/auth.routes";
import dotenv from "dotenv";
dotenv.config();

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userRoute);

async function start() {
  try {
    await mongoose.connect(`${process.env.MONGODB_LINK}`);
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log("Having issue while connecting to mongoDB");
  }
  app.listen(8080, () => {
    console.log("server is started");
  });
}
start();
