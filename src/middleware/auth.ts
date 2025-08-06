import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { decode } from "../utils/jwt";

const registerSchema = z.object({
  username: z.string(),
  email: z.email("Invalid email"),
  password: z.string().min(8),
  role: z.enum(["client", "freelancer", "admin"]).optional(),
  location: z.string(),
  languages: z.array(z.string()),
});

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8),
});

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
    return;
  }
};

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.token) {
    const decoded = decode(req.cookies.token);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    (req as any).decoded = decoded;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
