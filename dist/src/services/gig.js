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
exports.getAllGigs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Gig_1 = __importDefault(require("../models/Gig"));
const getAllGigs = (userId, filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const matchStage = {};
        if (filters === null || filters === void 0 ? void 0 : filters.q) {
            matchStage.title = { $regex: filters.q, $options: "i" };
        }
        const gigs = yield Gig_1.default.aggregate([
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
                                userId: new mongoose_1.default.Types.ObjectId(userId),
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
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching gigs");
    }
});
exports.getAllGigs = getAllGigs;
//# sourceMappingURL=gig.js.map