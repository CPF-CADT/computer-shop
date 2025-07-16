import { Encryption } from '../service/encription';
import JWT from '../service/JWT'

describe('Security Services', () => {
    it('[SEC-001] Encrypts and verifies password correctly', () => {
        const password = '1234';
        const hashed = Encryption.hashPassword(password);
        const isMatch = Encryption.verifyPassword(hashed, password);
        expect(isMatch).toBe(true);
    });

    it('[SEC-002] JWT correctly creates and verifies a token', () => {
        const jwtToken = JWT.create({ customer_id: 10, customer_phone_number: '078569811' });
        const decoded = JWT.verify(jwtToken);
        expect(decoded).toMatchObject({ id: 10, phone_number: '078569811' });
    });
});