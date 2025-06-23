import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { Customer } from './Customer';

@Table({
  tableName: 'two_fa_token',
  timestamps: false,
})
export class TwoFaToken extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  tfa_id!: number;

  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  customer_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  code!: string;

  @Column(DataType.DATE)
  expire_at!: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_used!: boolean;

  @BelongsTo(() => Customer)
  customer!: Customer;
}
