import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany, Default, Unique, HasOne, AllowNull } from 'sequelize-typescript';
import { Address } from './Address';
import { Orders } from './Orders';
import { ProductFeedback } from './ProductFeedback';
import { CartItem } from './CartItem';
import { TwoFaToken } from './TwoFaToken';

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

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  registration_date!: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  login_date?: Date;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  profile_img_path?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_verifyed!: boolean;


  @HasMany(() => Address)
  addresses!: Address[];

  @HasMany(() => ProductFeedback)
  feedbacks!: ProductFeedback[];

  @HasMany(() => Orders)
  orders!: Orders[];

  @HasMany(() => CartItem)
  cartItems!: CartItem[];

  @HasOne(() => TwoFaToken)
  twoFaToken!: TwoFaToken;
}
