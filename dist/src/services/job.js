"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllJobs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Job_1 = __importDefault(require("../models/Job"));
const getAllJobs = (userId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchStage = {};
        if (filters === null || filters === void 0 ? void 0 : filters.q) {
            matchStage.title = { $regex: filters.q, $options: "i" };
        }
        const jobs = yield Job_1.default.aggregate([
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
                                userId: new mongoose_1.default.Types.ObjectId(userId),
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
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching jobs");
    }
});
exports.getAllJobs = getAllJobs;
//# sourceMappingURL=job.js.map