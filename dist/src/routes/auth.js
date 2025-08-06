"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/register", auth_2.validateRegister, auth_1.register);
exports.authRouter.post("/login", auth_2.validateLogin, auth_1.login);
exports.authRouter.get("/profile", auth_2.isAuthenticated, auth_1.getProfile);
exports.authRouter.put("/profile", auth_2.isAuthenticated, auth_1.updateProfile);
exports.authRouter.get("/me", auth_2.isAuthenticated, auth_1.getMe);
//# sourceMappingURL=auth.js.map