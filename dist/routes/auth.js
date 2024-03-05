"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const model_1 = require("../models/model");
const jwt = __importStar(require("jsonwebtoken"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const router = (0, express_1.Router)();
let users = [
    {
        id: "13231",
        email: "ivan.donfack@yahoo.fr",
        password: "12345678",
    },
    {
        id: "1323ds1",
        email: "t@gmail.com",
        password: "12345678",
    },
];
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield model_1.User.findOne({ email: body.email });
        if (!user) {
            return next(new errorHandler_1.default("user_not_found", 404));
        }
        if (user.password !== body.password) {
            return next(new errorHandler_1.default("wrong_password", 401));
        }
        const token = jwt.sign({
            email: user.email,
            userId: user.id,
        }, "secret123", { expiresIn: "1h" });
        const resUser = {
            id: user._id,
            email: user.email,
            expiresIn: "3600",
            idToken: token,
        };
        res.status(201).json(resUser);
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
}));
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const existingUser = yield model_1.User.findOne({ email: body.email });
    if (existingUser) {
        return next(new errorHandler_1.default("email_exist", 401));
    }
    if (body.password.length < 5) {
        return next(new errorHandler_1.default("weak_password", 403));
    }
    const user = new model_1.User({
        email: body.email,
        password: body.password,
    });
    const newUser = yield user.save();
    const token = jwt.sign({
        email: newUser.email,
        userId: newUser.id,
    }, "secret123", { expiresIn: "1h" });
    const resUser = {
        id: newUser._id,
        email: newUser.email,
        expiresIn: "3600",
        idToken: token,
    };
    res.status(201).json(resUser);
}));
exports.default = router;
