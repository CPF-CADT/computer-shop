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
exports.getAllCategory = getAllCategory;
exports.getAllTypeProduct = getAllTypeProduct;
exports.getAllBrand = getAllBrand;
const CategoryAndTypeRepository_1 = require("../repositories/CategoryAndTypeRepository");
function getAllCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const category = yield CategoryAndTypeRepository_1.CategoryRepository.getAllCategory();
            res.status(200).json(category);
        }
        catch (err) {
            res.status(404).json({ message: 'Get category Error' + err });
        }
    });
}
function getAllTypeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const typeProduct = yield CategoryAndTypeRepository_1.TypeProductRepository.getAllTypeProduct();
            res.status(200).json(typeProduct);
        }
        catch (err) {
            res.status(404).json({ message: 'Get type product Error' + err });
        }
    });
}
function getAllBrand(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const brand = yield CategoryAndTypeRepository_1.BrandRepository.getAllBrand();
            res.status(200).json(brand);
        }
        catch (err) {
            res.status(404).json({ message: 'Get Brand Error' + err });
        }
    });
}
