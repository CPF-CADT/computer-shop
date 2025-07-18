import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
export  function normalizePhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith('0')) {
    return '+855' + phoneNumber.slice(1);
  }
  return phoneNumber;
}
export function sentSMS(phone_number:string,messageToSent:string){
    axios.post(`${process.env.INFOBIP_BASE_URL}/sms/2/text/advanced`, {

    messages: [
        {
        from: 'Tech Gear Shop',
        destinations: [{ to: normalizePhoneNumber(phone_number) }],
        text: messageToSent
        }
    ]
    }, {
    headers: {
        Authorization: `App ${process.env.INFOBIP_API_KEY}`,
        'Content-Type': 'application/json'
    }
    }).then(response => {
        console.log('SMS sent:', response.data);
    }).catch(error => {
        console.error('Error sending SMS:', error.response?.data || error.message);
    });
}