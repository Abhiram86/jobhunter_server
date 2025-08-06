import mongoose from "mongoose";
import Gig from "../models/Gig";

interface GigFilters {
  q?: string;
}

export const getAllGigs = async (
  userId: string | null,
  filters?: GigFilters
) => {
  try {
    const matchStage: any = {};

    if (filters?.q) {
      matchStage.title = { $regex: filters.q, $options: "i" };
    }

    const gigs = await Gig.aggregate([
      // Lookup freelancer
      { $match: matchStage },
      {
        $lookup: {
          from: "freelancers",
          localField: "freelancer",
          foreignField: "_id",
          as: "freelancer",
        },
      },
      { $unwind: "$freelancer" },

      // Lookup the user from users collection
      {
        $lookup: {
          from: "users",
          localField: "freelancer.user",
          foreignField: "_id",
          as: "freelancer.user", // This will replace the ObjectId with the actual user
        },
      },
      { $unwind: "$freelancer.user" },

      // Optionally check bookmarks
      ...(userId
        ? [
            {
              $lookup: {
                from: "bookmarks",
                let: {
                  gigId: "$_id",
                  userId: new mongoose.Types.ObjectId(userId),
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$target", "$$gigId"] },
                          { $eq: ["$user", "$$userId"] },
                          { $eq: ["$type", "gig"] },
                        ],
                      },
                    },
                  },
                  { $limit: 1 },
                ],
                as: "bookmark",
              },
            },
            {
              $addFields: {
                bookmarked: { $gt: [{ $size: "$bookmark" }, 0] },
              },
            },
          ]
        : [
            {
              $addFields: {
                bookmarked: false,
              },
            },
          ]),

      // Final projection - now matches GigCardProps interface
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          price: 1,
          deliveryTime: 1,
          skills: 1,
          status: 1,
          bookmarked: 1,
          createdAt: 1,
          "freelancer._id": 1,
          "freelancer.user._id": 1,
          "freelancer.user.username": 1,
        },
      },
    ]);
    return gigs;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching gigs");
  }
};
