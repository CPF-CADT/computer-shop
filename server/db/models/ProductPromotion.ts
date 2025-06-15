import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { Product } from './Product';
import { Promotion } from './Promotion';

@Table({
  tableName: 'productpromotion',
  timestamps: false,
})
export class ProductPromotion extends Model {
  @PrimaryKey
  @ForeignKey(() => Product)
  @Column(DataType.STRING(50))
  product_code!: string;

  @PrimaryKey
  @ForeignKey(() => Promotion)
  @Column(DataType.INTEGER)
  promotion_id!: number;
}