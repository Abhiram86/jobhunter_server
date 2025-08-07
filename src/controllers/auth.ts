import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import { Freelancer, Client } from "../models/Role";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  const newUserData: Omit<UserType, "createdAt" | "updatedAt"> = req.body;
  try {
    const existingUser = await User.findOne({ email: newUserData.email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(newUserData.password, 10);
    const newUser = await User.create({
      ...newUserData,
      password: hashedPassword,
    });
    res.set(
      "x-vercel-protection-bypass",
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    );
    res.set("x-vercel-set-bypass-cookie", "samesitenone");

    res.cookie("token", generateToken(String(newUser._id), newUser.role), {
      httpOnly: false,
      path: "/",
      secure: true,
      sameSite: "none",
      maxAge: 86400,
    });

    const userObject = newUser.toObject();
    if (userObject.role === "freelancer") {
      await createFreelancer(String(userObject._id));
    } else if (userObject.role === "client") {
      await createClient(String(userObject._id));
    }
    delete userObject.password;
    return res.status(201).json({
      user: userObject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const createFreelancer = async (userId: string, body?: any) => {
  try {
    const user = await Freelancer.create({
      user: userId,
      bio: body?.bio || "",
      rating: 0,
      experience: body?.experience || [],
      skills: body?.skills || [],
      availability: body?.availability || true,
      projects: body?.projects || [],
      socials: body?.socials || [],
    });
  } catch (error) {
    console.error(error);
  }
};

const createClient = async (userId: string, body?: any) => {
  try {
    await Client.create({
      user: userId,
      avgRatingGiven: 0,
      totalSpent: 0,
      about: body?.about || "",
      company: body?.company || "",
    });
  } catch (error) {
    console.error(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.set(
      "x-vercel-protection-bypass",
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    );
    res.set("x-vercel-set-bypass-cookie", "samesitenone");
    res.cookie("token", generateToken(String(user._id), user.role), {
      httpOnly: false,
      path: "/",
      secure: true,
      sameSite: "none",
      maxAge: 86400,
    });

    const userObject = user.toObject();
    delete userObject.password;
    userObject.role = role;
    return res.status(200).json({
      user: userObject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const decoded = (req as any).decoded;
  try {
    const [user, freelancer, client] = await Promise.all([
      User.findById(decoded.userId).lean(),
      Freelancer.findOne({ user: decoded.userId }).lean(),
      Client.findOne({ user: decoded.userId }).lean(),
    ]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      freelancer,
      client,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userType = req.query.type as string;
  try {
    if (userType === "freelancer") {
      const freelancer = await Freelancer.findOneAndUpdate(
        { user: (req as any).decoded.userId },
        req.body
      );
      if (!freelancer) {
        await createFreelancer((req as any).decoded.userId, req.body);
      }
      return res
        .status(201)
        .json({ success: true, message: "Profile updated" });
    } else if (userType === "client") {
      const client = await Client.findOneAndUpdate(
        { user: (req as any).decoded.userId },
        req.body
      );
      if (!client) {
        await createClient((req as any).decoded.userId, req.body);
      }
      return res
        .status(201)
        .json({ success: true, message: "Profile updated" });
    } else {
      const user = await User.findOneAndUpdate(
        { _id: (req as any).decoded.userId },
        req.body
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res
        .status(201)
        .json({ success: true, message: "Profile updated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const decoded = (req as any).decoded;
  const user = await User.findById(decoded.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const userObject = user.toObject();
  delete userObject.password;
  return res.status(200).json({
    user: userObject,
  });
};
