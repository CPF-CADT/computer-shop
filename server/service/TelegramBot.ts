// service/TelegramBot.ts
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Assuming you have imported your database models
import { Orders } from '../db/models/Orders';
import { OrderStatus } from '../db/models/Enums';

// Define the type for a single inline keyboard button
interface InlineKeyboardButton {
    text: string;
    callback_data: string;
}

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
        phoneNumber: string;
        address: string;
        totalAmount: number;
        expressHandle: string;
        items: string[];
    }) {
        const { orderId, customerName, phoneNumber, address, totalAmount, expressHandle, items } = body;
        const itemList = items.map(item => `- ${item}`).join('\n');

        const message = `🛒 *New Paid Order*\n👤 Customer: ${customerName}\n📞 Phone number: ${phoneNumber}\n📍 Address: ${address}\n🚚 Express: ${expressHandle}\n🧾 Order ID: ${orderId}\n📦 Items:\n${itemList}\n💵 Total: $${totalAmount}`;

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
        setInterval(() => this.pollForUpdates(), 5000);
        console.log("Polling for Telegram updates started.");
    }

    private async pollForUpdates() {
        try {
            const res = await axios.get(`https://api.telegram.org/bot${this.botToken}/getUpdates`, {
                params: { offset: this.lastUpdateId + 1, timeout: 30 }
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
                    const orderId = Number(action.split("_")[1]);

                    let newStatus: OrderStatus | null = null;
                    let statusText = '';
                    let newInlineKeyboard: InlineKeyboardButton[][] = []; // Array of arrays of InlineKeyboardButton

                    if (action.startsWith("accept_")) {
                        newStatus = OrderStatus.PROCESSING;
                        statusText = `✅ Order *${orderId}* was *ACCEPTED* by ${adminName}.`;
                        console.log(`Order ${orderId} accepted by ${adminName}. Setting status to PROCESSING.`);
                        newInlineKeyboard = [[{ text: "🚚 Deliver", callback_data: `deliver_${orderId}` }]];
                    } else if (action.startsWith("deliver_")) {
                        newStatus = OrderStatus.DELIVERED;
                        statusText = `✅ Order *${orderId}* was *DELIVERED* by ${adminName}.`;
                        console.log(`Order ${orderId} marked as delivered by ${adminName}. Setting status to DELIVERED.`);
                        newInlineKeyboard = []; // Empty array is still of type InlineKeyboardButton[][]
                    }

                    if (newStatus !== null && !isNaN(orderId)) {
                        try {
                            const order = await Orders.findByPk(orderId);

                            if (!order) {
                                console.error(`Order ${orderId} not found.`);
                                await axios.post(`https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`, {
                                    callback_query_id: callback.id,
                                    text: `Order ${orderId} not found.`,
                                    show_alert: true
                                });
                                return;
                            }

                            if (newStatus === OrderStatus.PROCESSING && order.order_status !== OrderStatus.PENDING) {
                                console.warn(`Attempted to process order ${orderId} which is not PENDING. Current status: ${order.order_status}`);
                                await axios.post(`https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`, {
                                    callback_query_id: callback.id,
                                    text: `Order ${orderId} must be PENDING to be accepted.`,
                                    show_alert: true
                                });
                                return;
                            }
                            if (newStatus === OrderStatus.DELIVERED && order.order_status !== OrderStatus.PROCESSING) {
                                console.warn(`Attempted to deliver order ${orderId} which is not PROCESSING. Current status: ${order.order_status}`);
                                await axios.post(`https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`, {
                                    callback_query_id: callback.id,
                                    text: `Order ${orderId} must be PROCESSING to be delivered.`,
                                    show_alert: true
                                });
                                return;
                            }


                            order.order_status = newStatus;
                            await order.save();

                            const updatedMessage = `${originalText}\n\n${statusText}`;

                            await axios.post(`https://api.telegram.org/bot${this.botToken}/editMessageText`, {
                                chat_id: chatId,
                                message_id: messageId,
                                text: updatedMessage,
                                parse_mode: "Markdown",
                                reply_markup: {
                                    inline_keyboard: newInlineKeyboard
                                }
                            });

                            await axios.post(`https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`, {
                                callback_query_id: callback.id,
                                text: `Order ${orderId} status changed to ${newStatus}!`,
                                show_alert: false
                            });

                        } catch (error: any) {
                            console.error(`Failed to update order status for ${orderId} directly:`, error.message);
                            await axios.post(`https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`, {
                                callback_query_id: callback.id,
                                text: `Error updating order ${orderId} status!`,
                                show_alert: true
                            });
                        }
                    } else if (isNaN(orderId)) {
                        console.error(`Invalid orderId received: ${action.split("_")[1]}`);
                        await axios.post(`https://api.telegram.org/bot${this.botToken}/answerCallbackQuery`, {
                            callback_query_id: callback.id,
                            text: `Invalid order ID.`,
                            show_alert: true
                        });
                    }
                }
            }
        } catch (err: any) {
        }
    }
}