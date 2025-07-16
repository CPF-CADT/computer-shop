import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Orders } from './Orders';
import { Product } from './Product';

@Table({
  tableName: 'orderitem',
  timestamps: false,
})
export class OrderItem extends Model {
  totalSoldQty(totalSoldQty: any, arg1: number): number {
      throw new Error('Method not implemented.');
  }
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
  
  @BelongsTo(() => Product, { foreignKey: 'product_code' })
  product!: Product;
}