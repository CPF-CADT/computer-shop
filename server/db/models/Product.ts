import { Table, Column, Model, DataType, PrimaryKey, Default, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Brand } from './Brand';
import { Category } from './Category';
import { TypeProduct } from './TypeProduct';
import { ProductFeedback } from './ProductFeedback';
import { InventoryLog } from './InventoryLog';
import { Supplier } from './Supplier';
import { ProductSupplier } from './ProductSupplier';
import { Promotion } from './Promotion';
import { ProductPromotion } from './ProductPromotion';
import { Orders } from './Orders';
import { OrderItem } from './OrderItem';

@Table({
  tableName: 'product',
  timestamps: false,
})
export class Product extends Model {
  @PrimaryKey
  @Column(DataType.STRING(50))
  product_code!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stock_quantity!: number;

  @Column(DataType.STRING(255))
  image_path?: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_active!: boolean;

  @Column(DataType.DATEONLY)
  last_restock_date?: Date;

  @ForeignKey(() => Brand)
  @Column(DataType.INTEGER)
  brand_id?: number;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  category_id?: number;

  @ForeignKey(() => TypeProduct)
  @Column(DataType.INTEGER)
  type_id?: number;
  
  @BelongsTo(() => Brand, { onDelete: 'SET NULL' })
  brand?: Brand;

  @BelongsTo(() => Category, { onDelete: 'SET NULL' })
  category?: Category;

  @BelongsTo(() => TypeProduct, { foreignKey: 'type_id' })
  type?: TypeProduct;

  @HasMany(() => ProductFeedback)
  feedbacks!: ProductFeedback[];

  @HasMany(() => InventoryLog)
  inventory_logs!: InventoryLog[];

  @BelongsToMany(() => Supplier, () => ProductSupplier)
  suppliers!: Supplier[];

  @BelongsToMany(() => Promotion, () => ProductPromotion)
  promotions!: Promotion[];

  @BelongsToMany(() => Orders, () => OrderItem)
  orders!: Orders[];
}