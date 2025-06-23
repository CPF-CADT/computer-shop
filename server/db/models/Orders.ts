import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, Default, BelongsToMany, HasMany } from 'sequelize-typescript';
import { OrderStatus } from './Enums';
import { Customer } from './Customer';
import { Address } from './Address';
import { Product } from './Product';
import { OrderItem } from './OrderItem';
import { PaymentTransaction } from './PaymentTransaction';

@Table({
  tableName: 'orders',
  timestamps: false,
})
export class Orders extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  order_id!: number;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer_id!: number;

  @ForeignKey(() => Address)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  address_id!: number;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  order_date!: Date;

  @Default(OrderStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
  })
  order_status!: OrderStatus;

  @BelongsTo(() => Customer, { onDelete: 'RESTRICT' })
  customer!: Customer;

  @BelongsTo(() => Address, { onDelete: 'RESTRICT' })
  address!: Address;

  @BelongsToMany(() => Product, () => OrderItem)
  items!: (Product & { OrderItem: OrderItem })[];
  
  @HasMany(() => PaymentTransaction)
  payment_transactions!: PaymentTransaction[];
}