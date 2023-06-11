import express, { Response, Request } from "express";
import { User, UserModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const userRoute = express.Router();

// <-----Middleware to verify access token--------->
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //start with "Bearer"

  if (!token) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  jwt.verify(token, `${process.env.ACCESS_KEY}`, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid access token" });
    }
    next();
  });
};

//<---------------User signup-------------->
userRoute.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password }: User = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({ message: "Email already exists" });
    }
    // encoding password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Signup successful", data: newUser });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//<---------------User login-------------->
userRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password }: User = req.body;
    //finding user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // decoding password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // access token
    const accessToken = jwt.sign(
      { email: user.email },
      `${process.env.ACCESS_KEY}`,
      {
        expiresIn: "120s",
      }
    );

    // refresh token
    const refreshToken = jwt.sign(
      { email: user.email },
      `${process.env.REFRESH_KEY}`
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//<---------------Request for refresh token-------------->
userRoute.post("/refresh-token", (req: Request, res: Response) => {
  const refreshToken: string = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided" });
  }

  // Verifying refresh token
  jwt.verify(
    refreshToken,
    `${process.env.REFRESH_KEY}`,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      //new access token
      const accessToken: string = jwt.sign(
        { email: decoded.email },
        `${process.env.ACCESS_KEY}`,
        {
          expiresIn: "120s",
        }
      );

      res.json({ accessToken });
    }
  );
});


//<---------------Get user profile-------------->
userRoute.get(
  "/profile",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userEmail = req.body.email;
      // Finding user
      const user = await UserModel.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ email: user.email }); // we can't send password
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);


//<---------------Delete user Account-------------->
userRoute.delete(
  "/delete-account",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      // Retrieve the user email from the request
      const userEmail = req.body.email;

      // Deleteing the user from mongoDB
      const result = await UserModel.deleteOne({ email: userEmail });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export { userRoute };
