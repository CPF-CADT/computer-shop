import twilio from 'twilio'
import dotenv from 'dotenv';
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;   
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER
export function generate4DigitToken(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
export function getExpiryDate(minutes: number): Date {
  const now = new Date();
  const expireUtc7 = new Date(now.getTime() + minutes * 60 * 1000 + 7 * 60 * 60 * 1000);
  return expireUtc7;
}

export function generateBillNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}


export function sentVerifyCodeViaSMS(messageBody:string,destinationPhoneNumbner:string ){
    const client = twilio(accountSid, authToken);
    client.messages
      .create({
         body: messageBody,
         from: twilioPhoneNumber,   
         to: destinationPhoneNumbner    
       })
      .then(message => console.log(`Message sent: ${message.sid}`))
      .catch(error => console.error(error));
}

