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
exports.applyJob = exports.createJob = exports.searchJobs = exports.bookmarkJob = exports.getBookmarkedJobs = exports.getJob = exports.getJobs = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const JobApplication_1 = __importDefault(require("../models/JobApplication"));
const Bookmark_1 = __importDefault(require("../models/Bookmark"));
const jwt_1 = require("../utils/jwt");
const job_1 = require("../services/job");
const Role_1 = require("../models/Role");
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.token
        ? (0, jwt_1.decode)(req.cookies.token).userId
        : null;
    try {
        const jobs = yield (0, job_1.getAllJobs)(userId);
        return res.status(200).json(jobs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.getJobs = getJobs;
const getJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield Job_1.default.findById(req.params.id).populate("client");
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        return res.status(200).json(job);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.getJob = getJob;
const getBookmarkedJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield Bookmark_1.default.find({
            user: req.decoded.userId,
            type: "job",
        });
        const jobIds = jobs.map((bookmark) => bookmark.target);
        const bookmarkedJobs = yield Job_1.default.find({ _id: { $in: jobIds } });
        return res.status(200).json(bookmarkedJobs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.getBookmarkedJobs = getBookmarkedJobs;
const bookmarkJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existing = yield Bookmark_1.default.findOne({
            target: req.params.id,
            user: req.decoded.userId,
        });
        if (existing) {
            yield Bookmark_1.default.findByIdAndDelete(existing._id);
            console.log("Bookmark deleted");
            return res.status(200).json({ message: "Bookmark Removed" });
        }
        else {
            yield Bookmark_1.default.create({
                target: req.params.id,
                user: req.decoded.userId,
                type: "job",
            });
            return res.status(200).json({ message: "Bookmarked" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.bookmarkJob = bookmarkJob;
const searchJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.token
        ? (0, jwt_1.decode)(req.cookies.token).userId
        : null;
    try {
        const jobs = yield (0, job_1.getAllJobs)(userId, { q: req.query.q });
        return res.status(200).json(jobs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.searchJobs = searchJobs;
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield Role_1.Client.findOne({ user: req.decoded.userId });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        const job = new Job_1.default(Object.assign(Object.assign({}, req.body), { client: client._id }));
        yield job.save();
        return res.status(201).json(job);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.createJob = createJob;
const applyJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const freelancer = yield Role_1.Freelancer.findOne({
            user: req.decoded.userId,
        });
        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found" });
        }
        const jobApplication = new JobApplication_1.default({
            job: req.params.id,
            freelancer: freelancer._id,
        });
        yield jobApplication.save();
        return res.status(201).json(jobApplication);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.applyJob = applyJob;
//# sourceMappingURL=job.js.map