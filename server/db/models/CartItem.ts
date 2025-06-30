import {
  Table, Column, Model, DataType, PrimaryKey, ForeignKey,
  AutoIncrement, AllowNull, BelongsTo,
  Default
} from 'sequelize-typescript';
import { Customer } from './Customer';
import { Product } from './Product';

@Table({
  tableName: 'cartitem',
  timestamps: false,
})
export class CartItem extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  cart_id!: number;

  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  customer_id!: number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.STRING(50))
  product_code!: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,    },
  })
  qty!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  price_at_purchase!: number;

  @Column(DataType.DATE)
  added_at!: Date;

  // Add these
  @BelongsTo(() => Customer)
  customer!: Customer;

  @BelongsTo(() => Product)
  product!: Product;
}
