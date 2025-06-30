import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();

// Import your model classes
import {
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
  TwoFaToken,
} from './models'; // Adjust import path if needed

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'mysql',
  logging: false, // Set to true to log SQL queries
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
    TwoFaToken,
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