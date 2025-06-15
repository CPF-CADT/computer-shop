"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const crypto_1 = require("crypto");
class Encryption {
    static hashPassword(password) {
        return (0, crypto_1.createHash)('sha256').update(password).digest('hex');
    }
    static verifyPassword(storedHashedPassword, inputPassword) {
        const hashedInput = this.hashPassword(inputPassword);
        return hashedInput === storedHashedPassword;
    }
}
exports.Encryption = Encryption;
console.log(Encryption.hashPassword("12345678"));
console.log(Encryption.verifyPassword("ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f", "12345678"));
