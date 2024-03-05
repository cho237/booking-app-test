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
const express_1 = require("express");
const model_1 = require("../models/model");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foods = yield model_1.Food.find();
        if (!foods)
            return next(new errorHandler_1.default("No foods found!", 500));
        res.status(200).json(foods);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.get("/tags", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield model_1.Tag.find();
        if (!tags)
            return next(new errorHandler_1.default("No Tag found!", 500));
        res.status(200).json(tags);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.post("/", is_auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const existingFood = yield model_1.Food.findOne({ name: body.name });
        if (existingFood)
            return next(new errorHandler_1.default("Food name already used!", 409));
        const food = new model_1.Food({
            name: body.name,
            price: body.price,
            imageUrl: body.imageUrl,
            cookTime: body.cookTime,
            origins: body.origins,
            tags: body.tags,
            createdBy: req.userId,
        });
        const newFood = yield food.save();
        res.status(201).json(newFood);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.post("/tag", is_auth_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const existingTag = yield model_1.Tag.findOne({ name: body.name });
        if (existingTag)
            return next(new errorHandler_1.default("Tag name already used!", 401));
        const tag = new model_1.Tag({
            name: body.name,
        });
        const newTag = yield tag.save();
        res.status(201).json(newTag);
    }
    catch (e) {
        return next(new errorHandler_1.default(e, 500));
    }
}));
router.delete("/tag/:id");
exports.default = router;
