import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(4),
  description: z.string().optional(),
  skills: z.array(z.string()),
});

export const validateNewJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if ((req as any).decoded.role !== "client") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    jobSchema.parse(req.body);
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};
