"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gigPurchaseSchema = new mongoose_1.default.Schema({
    gig: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Gig",
        required: true,
    },
    client: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "delivered", "completed", "cancelled"],
        default: "pending",
    },
    delivery: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("GigPurchase", gigPurchaseSchema);
//# sourceMappingURL=GigPurchase.js.map