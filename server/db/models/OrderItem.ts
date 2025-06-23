import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { Orders } from './Orders';
import { Product } from './Product';

@Table({
  tableName: 'orderitem',
  timestamps: false,
})
export class OrderItem extends Model {
  @PrimaryKey
  @ForeignKey(() => Orders)
  @Column(DataType.INTEGER)
  order_id!: number;

  @PrimaryKey
  @ForeignKey(() => Product)
  @Column(DataType.STRING(50))
  product_code!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  qty!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price_at_purchase!: number;
}