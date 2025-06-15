import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, BelongsToMany } from 'sequelize-typescript';
import { DiscountType } from './Enums';
import { Product } from './Product';
import { ProductPromotion } from './ProductPromotion';

@Table({
  tableName: 'promotion',
  timestamps: false,
})
export class Promotion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  promotion_id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(DiscountType)),
    allowNull: false,
  })
  discount_type!: DiscountType;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  discount_value!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  start_date!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  end_date!: Date;

  @BelongsToMany(() => Product, () => ProductPromotion)
  products!: Product[];
}