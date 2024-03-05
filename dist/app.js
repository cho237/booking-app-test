"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./routes/auth"));
const training_1 = __importDefault(require("./routes/training"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/training", training_1.default);
app.use("/auth", auth_1.default);
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An error occurred! Please try again" });
});
let url = 'mongodb+srv://tejiz:1234@cluster0.cblz1.mongodb.net/training';
mongoose_1.default.connect(url).then(result => {
    console.log("connected");
    app.listen(process.env.PORT || 5000);
}).catch((err) => console.log(err));
