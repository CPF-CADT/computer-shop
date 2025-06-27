// service/TelegramBot.ts
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
export class TelegramBot {
    private botToken: string;
    private groupId: string;
    private lastUpdateId = 0;

    constructor(
        botToken: string = process.env.TELEGRAM_BOT_TOKEN || '',
        groupId: string = process.env.TELEGRAM_GROUP_CHAT_ORDERS_ID || ''
    ) {
        this.botToken = botToken;
        this.groupId = groupId;
    }

  public async sendOrderNotification(body: {
    orderId: number;
    customerName: string;
    phoneNumber:string;
    address:string
    totalAmount: number;
    items: string[];
    }) {
    const { orderId, customerName,phoneNumber,address,totalAmount, items } = body;
    const itemList = items.map(item => `- ${item}`).join('\n');

    const message = `🛒 *New Paid Order*\n👤 Customer: ${customerName}\n👤 Phone number: ${phoneNumber}\n📍 Address: ${address}\n🧾 Order ID: ${orderId}\n📦 Items:\n${itemList}\n💵 Total: $${totalAmount}`;

    await axios.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      chat_id: this.groupId,
      text: message,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Accept", callback_data: `accept_${orderId}` }]
        ]
      }
    });
  }

  public startPolling() {
    setInterval(() => this.pollForUpdates(), 10000);
    console.log("Polling for Telegram updates started.");
  }

  private async pollForUpdates() {
    try {
      const res = await axios.get(`https://api.telegram.org/bot${this.botToken}/getUpdates`, {
        params: { offset: this.lastUpdateId + 1, timeout: 60 }
      });

      const updates = res.data.result;
      if (!updates?.length) return;

      for (const update of updates) {
        if (update.update_id > this.lastUpdateId) {
          this.lastUpdateId = update.update_id;
        }

        if (update.callback_query) {
          const callback = update.callback_query;
          const action = callback.data;
          const chatId = callback.message.chat.id;
          const messageId = callback.message.message_id;
          const adminName = callback.from.first_name || callback.from.username || "Someone";
          const originalText = callback.message.text || '';

          let statusText = '';
          if (action.startsWith("accept_")) {
            const orderId = action.split("_")[1];
            statusText = `✅ Order *${orderId}* was *ACCEPTED* by ${adminName}`;
            console.log(`Order ${orderId} accepted by ${adminName}.`);
          }

          const newText = `${originalText}\n\n${statusText}`;

          await axios.post(`https://api.telegram.org/bot${this.botToken}/editMessageText`, {
            chat_id: chatId,
            message_id: messageId,
            text: newText,
            parse_mode: "Markdown"
          });

          await axios.post(`https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`, {
            callback_query_id: callback.id,
            text: `Order ${action.split('_')[1]} ${action.split('_')[0]}d!`,
            show_alert: false
          });
        }
      }

    } catch (err: any) {
      console.error('Polling error:', err.message);
      if (err.response) console.error(err.response.data);
    }
  }
}
