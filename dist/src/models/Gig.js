"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gigSchema = new mongoose_1.default.Schema({
    freelancer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Freelancer",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "paused"],
        default: "active",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Gig", gigSchema);
//# sourceMappingURL=Gig.js.map