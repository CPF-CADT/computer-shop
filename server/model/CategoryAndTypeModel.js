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
exports.BrandModel = exports.TypeProductModel = exports.CategoryModel = void 0;
const database_integretion_1 = __importDefault(require("./database_integretion"));
class CategoryModel {
    static getAllCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield database_integretion_1.default.any('select * from category');
                return data.map(toCategoryStructure);
            }
            catch (err) {
                console.error('Error fetching category:', err);
                return null;
            }
        });
    }
}
exports.CategoryModel = CategoryModel;
class TypeProductModel {
    static getAllTypeProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield database_integretion_1.default.any('select * from typeproduct');
                return data.map(toTypeProductStructure);
            }
            catch (err) {
                console.error('Error fetching type product:', err);
                return null;
            }
        });
    }
}
exports.TypeProductModel = TypeProductModel;
class BrandModel {
    static getAllBrand() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield database_integretion_1.default.any('select * from brand');
                return data.map(toBrandStructure);
            }
            catch (err) {
                console.error('Error fetching brand:', err);
                return null;
            }
        });
    }
}
exports.BrandModel = BrandModel;
function toCategoryStructure(row) {
    return {
        id: row.category_id,
        title: row.title,
        description: row.description
    };
}
function toTypeProductStructure(row) {
    return {
        id: row.type_id,
        title: row.name,
        description: row.description
    };
}
function toBrandStructure(row) {
    return {
        id: row.id,
        name: row.name,
        url_logo: row.logo_url,
        website: row.website,
        country: row.country,
    };
}
