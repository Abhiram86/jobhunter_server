import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  getGigPurchases,
  purchaseGig,
  updateGig,
  bookmarkGig,
  getBookmarkedGigs,
  searchGigs,
} from "../controllers/gig";
import { validateNewGig } from "../middleware/gig";

export const gigRouter = express.Router();

gigRouter.post("/", isAuthenticated, validateNewGig, createGig);
gigRouter.get("/", getGigs);

gigRouter.get("/purchases", isAuthenticated, getGigPurchases);
gigRouter.get("/search", searchGigs);
gigRouter.get("/bookmark", isAuthenticated, getBookmarkedGigs);
gigRouter.post("/purchase/:id", isAuthenticated, purchaseGig);
gigRouter.post("/:id/bookmark", isAuthenticated, bookmarkGig);

gigRouter.get("/:id", getGig);
gigRouter.put("/:id", isAuthenticated, updateGig);
gigRouter.delete("/:id", isAuthenticated, deleteGig);

export default gigRouter;
