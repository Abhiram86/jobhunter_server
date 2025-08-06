"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gigRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const gig_1 = require("../controllers/gig");
const gig_2 = require("../middleware/gig");
exports.gigRouter = express_1.default.Router();
exports.gigRouter.post("/", auth_1.isAuthenticated, gig_2.validateNewGig, gig_1.createGig);
exports.gigRouter.get("/", gig_1.getGigs);
exports.gigRouter.get("/purchases", auth_1.isAuthenticated, gig_1.getGigPurchases);
exports.gigRouter.get("/search", gig_1.searchGigs);
exports.gigRouter.get("/bookmark", auth_1.isAuthenticated, gig_1.getBookmarkedGigs);
exports.gigRouter.post("/purchase/:id", auth_1.isAuthenticated, gig_1.purchaseGig);
exports.gigRouter.post("/:id/bookmark", auth_1.isAuthenticated, gig_1.bookmarkGig);
exports.gigRouter.get("/:id", gig_1.getGig);
exports.gigRouter.put("/:id", auth_1.isAuthenticated, gig_1.updateGig);
exports.gigRouter.delete("/:id", auth_1.isAuthenticated, gig_1.deleteGig);
exports.default = exports.gigRouter;
//# sourceMappingURL=gig.js.map