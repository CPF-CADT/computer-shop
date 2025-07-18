// This file acts as a central hub for all your models.
// It imports each model and then exports them all from one place.
// This ensures that when Sequelize loads your models, it finds every single one.

import { Address } from './Address';
import { Brand } from './Brand';
import { CartItem } from './CartItem';
import { Category } from './Category';
import { Customer } from './Customer';
import { InventoryLog } from './InventoryLog';
import { Orders } from './Orders';
import { OrderItem } from './OrderItem';
import { PaymentMethod } from './PaymentMethod';
import { PaymentTransaction } from './PaymentTransaction';
import { Product } from './Product';
import { ProductFeedback } from './ProductFeedback';
import { ProductPromotion } from './ProductPromotion';
import { ProductSupplier } from './ProductSupplier';
import { Promotion } from './Promotion';
import { Roles } from './Roles';
import { Staff } from './Staff';
import { Supplier } from './Supplier';
import { TypeProduct } from './TypeProduct';
import { TwoFaToken } from './TwoFaToken';

// Export all models so they can be imported elsewhere in your application
export {
  Address,
  Brand,
  CartItem,
  Category,
  Customer,
  InventoryLog,
  Orders,
  OrderItem,
  PaymentMethod,
  PaymentTransaction,
  Product,
  ProductFeedback,
  ProductPromotion,
  ProductSupplier,
  Promotion,
  Roles,
  Staff,
  Supplier,
  TypeProduct,
  TwoFaToken,
};
