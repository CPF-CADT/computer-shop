import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
export  function normalizePhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith('0')) {
    return '+855' + phoneNumber.slice(1);
  }
  return phoneNumber;
}
export async function sentSMS(phone_number:string,messageToSent:string): Promise<any> {
    try {
        const response = await axios.post(`${process.env.INFOBIP_BASE_URL}/sms/2/text/advanced`, {
            messages: [
                {
                    from: 'Tech Gear',
                    destinations: [{ to: normalizePhoneNumber(phone_number) }],
                    text: messageToSent
                }
            ]
        }, {
            headers: {
                Authorization: `App ${process.env.INFOBIP_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('SMS sent:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', (error as Error).message);
        throw error;
    }
}