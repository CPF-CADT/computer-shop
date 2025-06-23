import 'reflect-metadata';
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize-typescript';
import { Customer, Staff, Category, Brand, Supplier, Product, Promotion, 
        ProductPromotion, PaymentMethod, Address, TypeProduct, ProductFeedback, 
        InventoryLog, OrderItem, Orders, PaymentTransaction,ProductSupplier, 
        CartItem,TwoFaToken} from './models/index'
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    logging: false, // Set to true to see SQL queries
    models: [
        Customer,
        Staff,
        Category,
        Brand,
        Supplier,
        Promotion,
        PaymentMethod,
        Address,
        TypeProduct,
        Product,
        ProductFeedback,
        InventoryLog,
        Orders,
        OrderItem,
        PaymentTransaction,
        ProductSupplier,
        ProductPromotion,
        CartItem,
        TwoFaToken
    ],
});

export async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection successfully.');
    } catch (error) {
        console.error('Unable to connect : ', error);
    }
}