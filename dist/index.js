"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./src/config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./src/routes/auth");
const job_1 = __importDefault(require("./src/routes/job"));
const gig_1 = require("./src/routes/gig");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
(0, db_1.connectDB)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.options("(.*)", (0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
app.use((req, _res, next) => {
    req.io = io;
    next();
});
app.use((req, _res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use("/auth", auth_1.authRouter);
app.use("/jobs", job_1.default);
app.use("/gigs", gig_1.gigRouter);
app.get("/", (req, res) => {
    res.send("server running");
});
httpServer.listen(8080, () => {
    console.log("server running on http://localhost:8080");
});
//# sourceMappingURL=index.js.map