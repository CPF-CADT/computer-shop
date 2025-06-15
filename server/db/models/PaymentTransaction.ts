import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { Orders } from './Orders';
import { PaymentMethod } from './PaymentMethod';

@Table({
  tableName: 'paymenttransaction',
  timestamps: false,
})
export class PaymentTransaction extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  transaction_id!: number;

  @ForeignKey(() => Orders)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id!: number;

  @ForeignKey(() => PaymentMethod)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  pay_method_id!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  status!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  transaction_date!: Date;

  @BelongsTo(() => Orders, { onDelete: 'CASCADE' })
  order!: Orders;

  @BelongsTo(() => PaymentMethod, { onDelete: 'RESTRICT' })
  payment_method!: PaymentMethod;
}