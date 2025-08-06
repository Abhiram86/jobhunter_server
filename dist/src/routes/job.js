"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const job_1 = require("../controllers/job");
const job_2 = require("../middleware/job");
exports.jobRouter = express_1.default.Router();
exports.jobRouter.get("/", job_1.getJobs);
exports.jobRouter.post("/", auth_1.isAuthenticated, job_2.validateNewJob, job_1.createJob);
exports.jobRouter.get("/search", job_1.searchJobs);
exports.jobRouter.get("/bookmark", auth_1.isAuthenticated, job_1.getBookmarkedJobs);
exports.jobRouter.get("/:id", job_1.getJob);
exports.jobRouter.post("/:id/bookmark", auth_1.isAuthenticated, job_1.bookmarkJob);
exports.jobRouter.post("/apply/:id", auth_1.isAuthenticated, job_1.applyJob);
exports.default = exports.jobRouter;
//# sourceMappingURL=job.js.map