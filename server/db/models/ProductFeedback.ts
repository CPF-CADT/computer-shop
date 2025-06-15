import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { Customer } from './Customer';
import { Product } from './Product';

@Table({
  tableName: 'productfeedback',
  timestamps: false,
})
export class ProductFeedback extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  feedback_id!: number;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer_id!: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  product_code!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating!: number;

  @Column(DataType.TEXT)
  comment?: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  feedback_date!: Date;

  @BelongsTo(() => Customer, { onDelete: 'CASCADE' })
  customer!: Customer;

  @BelongsTo(() => Product, { onDelete: 'CASCADE' })
  product!: Product;
}