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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.validateLogin = exports.validateRegister = void 0;
const zod_1 = require("zod");
const jwt_1 = require("../utils/jwt");
const registerSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(["client", "freelancer", "admin"]).optional(),
    location: zod_1.z.string(),
    languages: zod_1.z.array(zod_1.z.string()),
});
const validateRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        registerSchema.parse(req.body);
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
});
exports.validateRegister = validateRegister;
const loginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email"),
    password: zod_1.z.string().min(8),
});
const validateLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        loginSchema.parse(req.body);
        next();
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
        return;
    }
});
exports.validateLogin = validateLogin;
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.token) {
        const decoded = (0, jwt_1.decode)(req.cookies.token);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.decoded = decoded;
        next();
    }
    else {
        res.status(401).json({ error: "Unauthorized" });
    }
});
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=auth.js.map