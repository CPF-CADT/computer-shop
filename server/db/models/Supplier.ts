import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, BelongsToMany } from 'sequelize-typescript';
import { Product } from './Product';
import { ProductSupplier } from './ProductSupplier';

@Table({
  tableName: 'supplier',
  timestamps: false,
})
export class Supplier extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  supplier_id!: number;

  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Unique
  @Column(DataType.STRING(255))
  email?: string;

  @Column(DataType.STRING(50))
  phone_number?: string;

  @Column(DataType.STRING(100))
  type_supply?: string;

  @Column(DataType.TEXT)
  address?: string;

  @Column(DataType.TEXT)
  notes?: string;
  
  @BelongsToMany(() => Product, () => ProductSupplier)
  products!: Product[];
}