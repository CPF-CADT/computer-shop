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
exports.createUser = createUser;
const userRepositories_1 = require("../repositories/userRepositories");
const encription_1 = require("../logic/encription");
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        const { name, phone_number, profile_url, password } = body;
        if (!name || !phone_number || !password) {
            res.status(400).json({ error: 'cannot get the information of user' });
        }
        try {
            yield userRepositories_1.CusomerRepository.createNewUser(name, phone_number, (profile_url) ? profile_url : null, encription_1.Encryption.hashPassword(password));
            res.status(201).json({ message: 'user create success ' });
        }
        catch (error) {
            res.status(400).json({ err: 'user create fail ' + error });
        }
    });
}
