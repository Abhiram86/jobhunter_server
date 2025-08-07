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
exports.getMe = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const Role_1 = require("../models/Role");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUserData = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email: newUserData.email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newUserData.password, 10);
        const newUser = yield User_1.default.create(Object.assign(Object.assign({}, newUserData), { password: hashedPassword }));
        res.set("x-vercel-protection-bypass", process.env.VERCEL_AUTOMATION_BYPASS_SECRET);
        res.set("x-vercel-set-bypass-cookie", "samesitenone");
        res.setHeader("Set-Cookie", `token=${(0, jwt_1.generateToken)(String(newUser._id), newUser.role)}; Path=/; Secure; SameSite=None; Max-Age=86400; Domain=.jobhunter-server.vercel.app`);
        const userObject = newUser.toObject();
        if (userObject.role === "freelancer") {
            yield createFreelancer(String(userObject._id));
        }
        else if (userObject.role === "client") {
            yield createClient(String(userObject._id));
        }
        delete userObject.password;
        return res.status(201).json({
            user: userObject,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.register = register;
const createFreelancer = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Role_1.Freelancer.create({
            user: userId,
            bio: (body === null || body === void 0 ? void 0 : body.bio) || "",
            rating: 0,
            experience: (body === null || body === void 0 ? void 0 : body.experience) || [],
            skills: (body === null || body === void 0 ? void 0 : body.skills) || [],
            availability: (body === null || body === void 0 ? void 0 : body.availability) || true,
            projects: (body === null || body === void 0 ? void 0 : body.projects) || [],
            socials: (body === null || body === void 0 ? void 0 : body.socials) || [],
        });
    }
    catch (error) {
        console.error(error);
    }
});
const createClient = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Role_1.Client.create({
            user: userId,
            avgRatingGiven: 0,
            totalSpent: 0,
            about: (body === null || body === void 0 ? void 0 : body.about) || "",
            company: (body === null || body === void 0 ? void 0 : body.company) || "",
        });
    }
    catch (error) {
        console.error(error);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.set("x-vercel-protection-bypass", process.env.VERCEL_AUTOMATION_BYPASS_SECRET);
        res.set("x-vercel-set-bypass-cookie", "samesitenone");
        res.setHeader("Set-Cookie", `token=${(0, jwt_1.generateToken)(String(user._id), role)}; Path=/; Secure; SameSite=None; Max-Age=86400; Domain=.jobhunter-server.vercel.app`);
        const userObject = user.toObject();
        delete userObject.password;
        userObject.role = role;
        return res.status(200).json({
            user: userObject,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = req.decoded;
    try {
        const [user, freelancer, client] = yield Promise.all([
            User_1.default.findById(decoded.userId).lean(),
            Role_1.Freelancer.findOne({ user: decoded.userId }).lean(),
            Role_1.Client.findOne({ user: decoded.userId }).lean(),
        ]);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({
            freelancer,
            client,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userType = req.query.type;
    try {
        if (userType === "freelancer") {
            const freelancer = yield Role_1.Freelancer.findOneAndUpdate({ user: req.decoded.userId }, req.body);
            if (!freelancer) {
                yield createFreelancer(req.decoded.userId, req.body);
            }
            return res
                .status(201)
                .json({ success: true, message: "Profile updated" });
        }
        else if (userType === "client") {
            const client = yield Role_1.Client.findOneAndUpdate({ user: req.decoded.userId }, req.body);
            if (!client) {
                yield createClient(req.decoded.userId, req.body);
            }
            return res
                .status(201)
                .json({ success: true, message: "Profile updated" });
        }
        else {
            const user = yield User_1.default.findOneAndUpdate({ _id: req.decoded.userId }, req.body);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res
                .status(201)
                .json({ success: true, message: "Profile updated" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
});
exports.updateProfile = updateProfile;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = req.decoded;
    const user = yield User_1.default.findById(decoded.userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const userObject = user.toObject();
    delete userObject.password;
    return res.status(200).json({
        user: userObject,
    });
});
exports.getMe = getMe;
//# sourceMappingURL=auth.js.map