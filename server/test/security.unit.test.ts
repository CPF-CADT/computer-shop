import { Encryption } from '../service/encription';
import JWT from '../service/JWT'

describe('security', () => {
  it('Encrypts and verifies password correctly', () => {
    const password = '1234';
    const hashed = Encryption.hashPassword(password);
    const isMatch = Encryption.verifyPassword(hashed, password);
    expect(isMatch).toBe(true);
  });
});
describe('security',()=>{
  it('JWT correctly create and verified',()=>{
    const jwtToken = JWT.create(
      {customer_id:10,customer_phone_number:'078569811'}
    )
    const decoded = JWT.verify(jwtToken)
    expect(decoded).toMatchObject({
      id: 10,
      phone_number: '078569811'
    });
  })
})
