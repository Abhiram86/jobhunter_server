import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  applyJob,
  bookmarkJob,
  createJob,
  getBookmarkedJobs,
  getJob,
  getJobs,
  searchJobs,
} from "../controllers/job";
import { validateNewJob } from "../middleware/job";

export const jobRouter = express.Router();

jobRouter.get("/", getJobs);
jobRouter.post("/", isAuthenticated, validateNewJob, createJob);
jobRouter.get("/search", searchJobs);
jobRouter.get("/bookmark", isAuthenticated, getBookmarkedJobs);
jobRouter.get("/:id", getJob);
jobRouter.post("/:id/bookmark", isAuthenticated, bookmarkJob);
jobRouter.post("/apply/:id", isAuthenticated, applyJob);

export default jobRouter;
