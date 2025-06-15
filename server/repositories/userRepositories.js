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
exports.CusomerRepository = void 0;
const UserModel_1 = require("../model/UserModel");
const database_integretion_1 = __importDefault(require("../db/database_integretion"));
class CusomerRepository {
    static getUser(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            let quey = 'select * from customer ';
            if (phoneNumber) {
                quey += `where phone_number = ${phoneNumber} ;`;
            }
            else {
                quey += ';';
            }
            let data = yield database_integretion_1.default.any(quey);
            return data.map(UserModel_1.toCustomerStructure);
        });
    }
    static createNewUser(name, phone_number, usr_profile_url, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield database_integretion_1.default.none('INSERT INTO Customer (name, phone_number, registration_date,profile_img_path ,password) VALUES ($(cname), $(cphone_number), $(cregistration_date), $(profile_url),$(cpass))', {
                    cname: name,
                    cphone_number: phone_number,
                    cregistration_date: new Date().toISOString(),
                    profile_url: usr_profile_url,
                    cpass: password
                });
                console.log("User successfully created.");
                return true;
            }
            catch (error) {
                console.error("Error creating user:", error);
                throw error;
            }
        });
    }
}
exports.CusomerRepository = CusomerRepository;
