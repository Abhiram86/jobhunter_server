import { Request, Response } from "express";
import Gig from "../models/Gig";
import GigPurchase from "../models/GigPurchase";
import Bookmark from "../models/Bookmark";
import { decode } from "../utils/jwt";
import mongoose from "mongoose";
import { getAllGigs } from "../services/gig";
import { Client, Freelancer } from "../models/Role";

export const createGig = async (req: Request, res: Response) => {
  try {
    const freelancer = await Freelancer.findOne({
      user: (req as any).decoded.userId,
    });
    if (!freelancer) {
      return res.status(404).json({ error: "Freelancer not found" });
    }
    const gig = new Gig({
      ...req.body,
      freelancer: freelancer._id,
    });
    await gig.save();
    return res.status(201).json(gig);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getGigs = async (req: Request, res: Response) => {
  const userId = req.cookies.token
    ? (decode(req.cookies.token) as { userId: string }).userId
    : null;
  console.log(userId);

  try {
    const gigs = await getAllGigs(userId);
    return res.status(200).json(gigs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getGig = async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("freelancer");
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }
    return res.status(200).json(gig);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getBookmarkedGigs = async (req: Request, res: Response) => {
  try {
    const gigs = await Bookmark.find({
      user: (req as any).decoded.userId,
      type: "gig",
    });
    const gigIds = gigs.map((bookmark) => bookmark.target);
    const bookmarkedGigs = await Gig.find({ _id: { $in: gigIds } });
    return res.status(200).json(bookmarkedGigs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const bookmarkGig = async (req: Request, res: Response) => {
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
        type: "gig",
      });
      return res.status(200).json({ message: "Bookmarked" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateGig = async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findOneAndUpdate(
      { _id: req.params.id, freelancer: (req as any).decoded.userId },
      req.body,
      { new: true }
    );
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }
    return res.status(200).json(gig);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteGig = async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findOneAndDelete({
      _id: req.params.id,
      freelancer: (req as any).decoded.userId,
    });
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }
    return res.status(200).json({ message: "Gig deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const purchaseGig = async (req: Request, res: Response) => {
  try {
    const client = await Client.findOne({
      user: (req as any).decoded.userId,
    });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }
    const gigPurchase = new GigPurchase({
      gig: gig._id,
      client: client._id,
    });
    await gigPurchase.save();
    return res.status(201).json(gigPurchase);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const searchGigs = async (req: Request, res: Response) => {
  const userId = req.cookies.token
    ? (decode(req.cookies.token) as { userId: string }).userId
    : null;

  try {
    const gigs = await getAllGigs(userId, { q: req.query.q as string });
    return res.status(200).json(gigs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getGigPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await GigPurchase.find({
      client: (req as any).decoded.userId,
    }).populate("gig freelancer");
    return res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
