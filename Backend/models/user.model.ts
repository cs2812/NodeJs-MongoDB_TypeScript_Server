import { Schema, model } from "mongoose";

export type User = {
  email: string;
  password: string;
};

const userSchema = new Schema<User>({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
});

export const UserModel = model<User>("user", userSchema);
