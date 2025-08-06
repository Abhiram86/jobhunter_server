import mongoose from "mongoose";
import Job from "../models/Job";

interface JobFilters {
  q?: string;
}

export const getAllJobs = async (
  userId: string | null,
  filters?: JobFilters
) => {
  try {
    const matchStage: any = {};

    if (filters?.q) {
      matchStage.title = { $regex: filters.q, $options: "i" };
    }

    const jobs = await Job.aggregate([
      { $match: matchStage },
      // Lookup applications
      {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "job_id",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationCount: { $size: "$applications" },
        },
      },

      // Lookup client details
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup client user
      {
        $lookup: {
          from: "users",
          localField: "client.user",
          foreignField: "_id",
          as: "client.user",
        },
      },
      {
        $unwind: {
          path: "$client.user",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Conditionally check bookmarks only if logged in
      ...(userId
        ? [
            {
              $lookup: {
                from: "bookmarks",
                let: {
                  jobId: "$_id",
                  userId: new mongoose.Types.ObjectId(userId),
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$target", "$$jobId"] },
                          { $eq: ["$user", "$$userId"] },
                          { $eq: ["$type", "job"] },
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

      // Final projection
      {
        $project: {
          "client.company": 1,
          "client._id": 1,
          "client.user.username": 1,
          "client.user._id": 1,
          applicationCount: 1,
          title: 1,
          description: 1,
          status: 1,
          skills: 1,
          bookmarked: 1,
          createdAt: 1,
        },
      },
    ]);
    return jobs;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching jobs");
  }
};
