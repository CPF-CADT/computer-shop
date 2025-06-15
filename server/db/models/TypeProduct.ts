import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Product } from './Product';

@Table({
  tableName: 'typeproduct',
  timestamps: false,
})
export class TypeProduct extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    type_id!: number;

    @Column(DataType.STRING(100))
    name?: string;

    @Column(DataType.STRING(255))
    description?: string;

    @HasMany(() => Product)
    products!: Product[];
}