"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = exports.Tag = exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
const tagSchema = new mongoose_1.Schema({
    name: { type: String, required: true }
}, { timestamps: true });
exports.Tag = (0, mongoose_1.model)('Tag', tagSchema);
const foodSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    cookTime: { type: String, required: true },
    origins: [{ type: String, required: true }],
    favourite: [{ type: Boolean, required: true, default: false }],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    tags: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Tag",
        }],
}, { timestamps: true });
exports.Food = (0, mongoose_1.model)('Food', foodSchema);
