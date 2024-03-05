"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const router = (0, express_1.Router)();
let ingredients = [
    { id: "1", name: "Tomato", amount: 10 },
    { id: "sdfa1", name: "peper", amount: 20 },
];
let recipes = [
    {
        id: "sdfa1fg",
        name: "Rice",
        description: "The best meal you can get",
        imagePath: "https://static.toiimg.com/thumb/56933159.cms?imgsize=686279&width=800&height=800",
        ingredients: [{ id: "4", name: "bread", amount: 20 }],
    },
    {
        id: "sdfadf1fg",
        name: "A est Recipe",
        description: "Just trying",
        imagePath: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505",
        ingredients: [{ id: "4", name: "bread", amount: 20 }],
    },
];
router.get("/", is_auth_1.default, (req, res, next) => {
    try {
        console.log(req.userId);
        res.status(200).json(recipes);
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
router.get("/ingredients", is_auth_1.default, (req, res, next) => {
    try {
        res.status(200).json(ingredients);
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
router.put("/recipes", is_auth_1.default, (req, res, next) => {
    const body = req.body;
    recipes = [...body];
    res.status(200).json(recipes);
});
router.post("/", is_auth_1.default, (req, res, next) => {
    try {
        const id = Date.now().toString();
        const { name, description, imagePath } = req.body;
        const newRecipe = {
            id: id,
            name: name,
            description: description,
            imagePath: imagePath,
            ingredients: [],
        };
        recipes.push(newRecipe);
        res.status(201).json({ name: id });
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
router.post("/ingredients", is_auth_1.default, (req, res, next) => {
    try {
        const id = Date.now().toString();
        const { name, amount } = req.body;
        const newIngredient = {
            id: id,
            name: name,
            amount: amount,
        };
        ingredients.push(newIngredient);
        res.status(201).json({ name: id });
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
router.delete("/ingredients/:id", is_auth_1.default, (req, res, next) => {
    try {
        ingredients = ingredients.filter((i) => i.id !== req.params.id);
        res.status(200).json({ deleted: true });
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
router.delete("/recipe/:id", is_auth_1.default, (req, res, next) => {
    try {
        recipes = recipes.filter((r) => r.id !== req.params.id);
        res.status(200).json({ deleted: true });
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
router.put("/recipe/:id", (req, res, next) => {
    try {
        const { name, description, imagePath } = req.body;
        const recipeIndex = recipes.findIndex((r) => r.id == req.params.id);
        recipes[recipeIndex].name = name;
        recipes[recipeIndex].description = description;
        recipes[recipeIndex].imagePath = imagePath;
        res.status(200).json({ updated: true });
    }
    catch (err) {
        return next(new errorHandler_1.default(err, 500));
    }
});
exports.default = router;
