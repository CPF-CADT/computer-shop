import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany, Default, Unique } from 'sequelize-typescript';
import { Address } from './Address';
import { Orders } from './Orders';
import { ProductFeedback } from './ProductFeedback';

@Table({
  tableName: 'customer',
  timestamps: false,
})
export class Customer extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  customer_id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  phone_number!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  registration_date!: Date;

  @Column(DataType.DATE)
  login_date?: Date;

  @Column(DataType.STRING(255))
  profile_img_path?: string;

  @HasMany(() => Address)
  addresses!: Address[];

  @HasMany(() => ProductFeedback)
  feedbacks!: ProductFeedback[];

  @HasMany(() => Orders)
  orders!: Orders[];
}