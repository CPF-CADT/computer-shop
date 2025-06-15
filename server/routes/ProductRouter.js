"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductController_1 = require("../controller/ProductController");
const express_1 = __importDefault(require("express"));
const productRouter = express_1.default.Router();
productRouter.get('/', ProductController_1.getAllProduct);
productRouter.get('/:product_code', ProductController_1.getOneProduct);
productRouter.get('/:product_code/detail', ProductController_1.getProductDetail);
exports.default = productRouter;
