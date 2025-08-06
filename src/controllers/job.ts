import Job from "../models/Job";
import JobApplication from "../models/JobApplication";
import { Request, Response } from "express";
import Bookmark from "../models/Bookmark";
import { decode } from "../utils/jwt";
import { getAllJobs } from "../services/job";
import { Client, Freelancer } from "../models/Role";

export const getJobs = async (req: Request, res: Response) => {
  const userId = req.cookies.token
    ? (decode(req.cookies.token) as { userId: string }).userId
    : null;

  try {
    const jobs = await getAllJobs(userId);
    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate("client");
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    return res.status(200).json(job);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getBookmarkedJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Bookmark.find({
      user: (req as any).decoded.userId,
      type: "job",
    });
    const jobIds = jobs.map((bookmark) => bookmark.target);
    const bookmarkedJobs = await Job.find({ _id: { $in: jobIds } });
    return res.status(200).json(bookmarkedJobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const bookmarkJob = async (req: Request, res: Response) => {
  try {
    const existing = await Bookmark.findOne({
      target: req.params.id,
      user: (req as any).decoded.userId,
    });
    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      console.log("Bookmark deleted");
      return res.status(200).json({ message: "Bookmark Removed" });
    } else {
      await Bookmark.create({
        target: req.params.id,
        user: (req as any).decoded.userId,
        type: "job",
      });
      return res.status(200).json({ message: "Bookmarked" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const searchJobs = async (req: Request, res: Response) => {
  const userId = req.cookies.token
    ? (decode(req.cookies.token) as { userId: string }).userId
    : null;

  try {
    const jobs = await getAllJobs(userId, { q: req.query.q as string });
    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const client = await Client.findOne({ user: (req as any).decoded.userId });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    const job = new Job({
      ...req.body,
      client: client._id,
    });
    await job.save();
    return res.status(201).json(job);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const applyJob = async (req: Request, res: Response) => {
  try {
    const freelancer = await Freelancer.findOne({
      user: (req as any).decoded.userId,
    });
    if (!freelancer) {
      return res.status(404).json({ error: "Freelancer not found" });
    }
    const jobApplication = new JobApplication({
      job: req.params.id,
      freelancer: freelancer._id,
    });
    await jobApplication.save();
    return res.status(201).json(jobApplication);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
