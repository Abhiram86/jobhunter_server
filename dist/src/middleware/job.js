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
exports.validateNewJob = exports.jobSchema = void 0;
const zod_1 = require("zod");
exports.jobSchema = zod_1.z.object({
    title: zod_1.z.string().min(4),
    description: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()),
});
const validateNewJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.decoded.role !== "client") {
            return res.status(401).json({ error: "Unauthorized" });
        }
        exports.jobSchema.parse(req.body);
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
});
exports.validateNewJob = validateNewJob;
//# sourceMappingURL=job.js.map