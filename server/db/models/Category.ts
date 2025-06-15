import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, HasMany } from 'sequelize-typescript';
import { Product } from './Product';

@Table({
  tableName: 'category',
  timestamps: false,
})
export class Category extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  category_id!: number;

  @Unique
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @HasMany(() => Product)
  products!: Product[];
}