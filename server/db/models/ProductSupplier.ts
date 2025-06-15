import { Table, Column, Model, DataType, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { Product } from './Product';
import { Supplier } from './Supplier';

@Table({
  tableName: 'productsupplier',
  timestamps: false,
})
export class ProductSupplier extends Model {
  @PrimaryKey
  @ForeignKey(() => Product)
  @Column(DataType.STRING(50))
  product_code!: string;

  @PrimaryKey
  @ForeignKey(() => Supplier)
  @Column(DataType.INTEGER)
  supplier_id!: number;

  @Column(DataType.DECIMAL(10, 2))
  supply_cost?: number;

  @Column(DataType.DATEONLY)
  supply_date?: Date;

  @Column(DataType.INTEGER)
  quantity?: number;
}