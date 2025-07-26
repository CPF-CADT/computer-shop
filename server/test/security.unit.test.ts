import { Encryption } from '../service/encription';
import JWT from '../service/JWT'

describe('Security Services', () => {
    it('[CS-001] Encrypts and verifies password correctly', () => {
        const password = '1234';
        const hashed = Encryption.hashPassword(password);
        const isMatch = Encryption.verifyPassword(hashed, password);
        expect(isMatch).toBe(true);
    });

    it('[CS-002] JWT correctly creates and verifies a token', () => {
        const jwtToken = JWT.create({ id: 10, phone_number: '078569811' ,role:'customer'});
        const decoded = JWT.verify(jwtToken);
        expect(decoded).toMatchObject({ id: 10, phone_number: '078569811' });
    });
});