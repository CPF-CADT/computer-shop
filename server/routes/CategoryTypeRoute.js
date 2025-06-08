"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRouter = exports.typeProducRouter = exports.categoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const CategoryTypeCotroller_1 = require("../controller/CategoryTypeCotroller");
exports.categoryRouter = express_1.default.Router();
exports.categoryRouter.get('/', CategoryTypeCotroller_1.getAllCategory);
exports.typeProducRouter = express_1.default.Router();
exports.typeProducRouter.get('/', CategoryTypeCotroller_1.getAllTypeProduct);
exports.BrandRouter = express_1.default.Router();
exports.BrandRouter.get('/', CategoryTypeCotroller_1.getAllBrand);
