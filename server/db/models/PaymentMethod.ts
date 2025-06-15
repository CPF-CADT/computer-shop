import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, Default, HasMany } from 'sequelize-typescript';
import { PaymentTransaction } from './PaymentTransaction';

@Table({
  tableName: 'paymentmethod',
  timestamps: false,
})
export class PaymentMethod extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  pay_method_id!: number;

  @Unique
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  pay_method!: string;

  @Column(DataType.STRING(100))
  company_handle?: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_enable!: boolean;

  @HasMany(() => PaymentTransaction)
  transactions!: PaymentTransaction[];
}