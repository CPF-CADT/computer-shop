import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, HasMany } from 'sequelize-typescript';
import { Product } from './Product';

@Table({
  tableName: 'brand',
  timestamps: false,
})
export class Brand extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @Column(DataType.STRING(255))
  logo_url?: string;

  @Column(DataType.STRING(255))
  website?: string;

  @Column(DataType.STRING(100))
  country?: string;

  @HasMany(() => Product)
  products!: Product[];
}