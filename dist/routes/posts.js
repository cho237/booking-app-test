"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const router = (0, express_1.Router)();
let posts = [
    { id: "1234", title: "the best post", content: "where ever you are" },
    { id: "2234", title: "trying post", content: "are you ready??" },
];
router.get("/", (req, res, next) => {
    try {
        res.status(200).json(posts);
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
router.post("/", is_auth_1.default, (req, res, next) => {
    try {
        const body = req.body;
        const id = Date.now().toString();
        const newPost = {
            id: id,
            title: body.title,
            content: body.content,
        };
        posts.push(newPost);
        res.status(201).json({ name: id });
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
router.delete("/", (req, res, next) => {
    try {
        posts = [];
        res.status(200).json({ deleted: true });
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
// router.delete('/todo/:todoId', (req, res, next) => {
//     const params = req.params as RequestParams;
//     posts = posts.filter(todoItem => todoItem.id !== params.todoId);
//     res.status(200).json({message: "successfully", todos: posts})
// })
exports.default = router;
