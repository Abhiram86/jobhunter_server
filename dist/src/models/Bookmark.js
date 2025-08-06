"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookmarkSchema = new mongoose_1.default.Schema({
    target: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        enum: ["job", "gig"],
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Freelancer",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
bookmarkSchema.index({ target: 1, type: 1, user: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Bookmark", bookmarkSchema);
//# sourceMappingURL=Bookmark.js.map