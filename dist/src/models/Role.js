"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.Freelancer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const freelancerSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bio: {
        type: String,
    },
    rating: {
        type: Number,
    },
    experience: [
        {
            company: {
                type: String,
            },
            position: {
                type: String,
            },
            type: {
                type: String,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
        },
    ],
    skills: [
        {
            type: String,
        },
    ],
    availability: {
        type: Boolean,
    },
    projects: [
        {
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            technologies: [
                {
                    type: String,
                },
            ],
            link: {
                type: String,
            },
        },
    ],
    socials: [
        {
            name: {
                type: String,
            },
            link: {
                type: String,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const clientSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    company: {
        type: String,
        default: "N/A",
    },
    about: {
        type: String,
    },
    totalSpent: {
        type: Number,
    },
    avgRatingGiven: {
        type: Number,
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
exports.Freelancer = mongoose_1.default.model("Freelancer", freelancerSchema);
exports.Client = mongoose_1.default.model("Client", clientSchema);
//# sourceMappingURL=Role.js.map