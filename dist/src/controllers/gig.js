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
exports.getGigPurchases = exports.searchGigs = exports.purchaseGig = exports.deleteGig = exports.updateGig = exports.bookmarkGig = exports.getBookmarkedGigs = exports.getGig = exports.getGigs = exports.createGig = void 0;
const Gig_1 = __importDefault(require("../models/Gig"));
const GigPurchase_1 = __importDefault(require("../models/GigPurchase"));
const Bookmark_1 = __importDefault(require("../models/Bookmark"));
const jwt_1 = require("../utils/jwt");
const gig_1 = require("../services/gig");
const Role_1 = require("../models/Role");
const createGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const freelancer = yield Role_1.Freelancer.findOne({
            user: req.decoded.userId,
        });
        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found" });
        }
        const gig = new Gig_1.default(Object.assign(Object.assign({}, req.body), { freelancer: freelancer._id }));
        yield gig.save();
        return res.status(201).json(gig);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.createGig = createGig;
const getGigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.token
        ? (0, jwt_1.decode)(req.cookies.token).userId
        : null;
    console.log(userId);
    try {
        const gigs = yield (0, gig_1.getAllGigs)(userId);
        return res.status(200).json(gigs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.getGigs = getGigs;
const getGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gig = yield Gig_1.default.findById(req.params.id).populate("freelancer");
        if (!gig) {
            return res.status(404).json({ error: "Gig not found" });
        }
        return res.status(200).json(gig);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.getGig = getGig;
const getBookmarkedGigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gigs = yield Bookmark_1.default.find({
            user: req.decoded.userId,
            type: "gig",
        });
        const gigIds = gigs.map((bookmark) => bookmark.target);
        const bookmarkedGigs = yield Gig_1.default.find({ _id: { $in: gigIds } });
        return res.status(200).json(bookmarkedGigs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.getBookmarkedGigs = getBookmarkedGigs;
const bookmarkGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                type: "gig",
            });
            return res.status(200).json({ message: "Bookmarked" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.bookmarkGig = bookmarkGig;
const updateGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gig = yield Gig_1.default.findOneAndUpdate({ _id: req.params.id, freelancer: req.decoded.userId }, req.body, { new: true });
        if (!gig) {
            return res.status(404).json({ error: "Gig not found" });
        }
        return res.status(200).json(gig);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.updateGig = updateGig;
const deleteGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gig = yield Gig_1.default.findOneAndDelete({
            _id: req.params.id,
            freelancer: req.decoded.userId,
        });
        if (!gig) {
            return res.status(404).json({ error: "Gig not found" });
        }
        return res.status(200).json({ message: "Gig deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.deleteGig = deleteGig;
const purchaseGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield Role_1.Client.findOne({
            user: req.decoded.userId,
        });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        const gig = yield Gig_1.default.findById(req.params.id);
        if (!gig) {
            return res.status(404).json({ error: "Gig not found" });
        }
        const gigPurchase = new GigPurchase_1.default({
            gig: gig._id,
            client: client._id,
        });
        yield gigPurchase.save();
        return res.status(201).json(gigPurchase);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.purchaseGig = purchaseGig;
const searchGigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.token
        ? (0, jwt_1.decode)(req.cookies.token).userId
        : null;
    try {
        const gigs = yield (0, gig_1.getAllGigs)(userId, { q: req.query.q });
        return res.status(200).json(gigs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.searchGigs = searchGigs;
const getGigPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield GigPurchase_1.default.find({
            client: req.decoded.userId,
        }).populate("gig freelancer");
        return res.status(200).json(purchases);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.getGigPurchases = getGigPurchases;
//# sourceMappingURL=gig.js.map