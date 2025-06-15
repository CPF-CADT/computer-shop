import { createHash } from 'crypto';

export class Encryption {
    static hashPassword(password: string): string {
        return createHash('sha256').update(password).digest('hex');
    }
    static verifyPassword(storedHashedPassword: string, inputPassword: string): boolean {
        const hashedInput = this.hashPassword(inputPassword);
        return hashedInput === storedHashedPassword;
    }
}

console.log(Encryption.hashPassword("12345678"));

console.log(Encryption.verifyPassword(
    "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f",
    "12345678"
));
