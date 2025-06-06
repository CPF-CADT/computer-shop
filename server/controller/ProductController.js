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
exports.getAllProduct = getAllProduct;
exports.getOneProduct = getOneProduct;
exports.getProductDetail = getProductDetail;
const ProductModel_1 = __importDefault(require("../model/ProductModel"));
function getAllProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield ProductModel_1.default.getAllProduct();
            res.status(200).send(product);
        }
        catch (err) {
            res.status(404).json({ message: 'Get product Error' + err });
        }
    });
}
function getOneProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const productCode = req.params.product_code;
            const product = yield ProductModel_1.default.getOneProduct(productCode);
            res.status(200).send(product);
        }
        catch (err) {
            res.status(404).json({ message: 'Get product Error' + err });
        }
    });
}
function getProductDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const productCode = req.params.product_code;
            const product = yield ProductModel_1.default.getProductDetail(productCode);
            res.status(200).send(product);
        }
        catch (err) {
            res.status(404).json({ message: 'Get product Error' + err });
        }
    });
}
