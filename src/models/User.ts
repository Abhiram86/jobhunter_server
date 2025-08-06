import mongoose from "mongoose";

export interface UserType {
  username: string;
  email: string;
  password: string;
  role?: "client" | "freelancer" | "admin";
  location: string;
  languages: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<UserType>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<UserType>("User", userSchema);
