import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const gigSchema = z.object({
  title: z.string().min(4),
  description: z.string().optional(),
  category: z.string(),
  price: z.number(),
  deliveryTime: z.number(),
  skills: z.array(z.string()),
});

export const validateNewGig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req as any).decoded.role !== "freelancer") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    gigSchema.parse(req.body);
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
