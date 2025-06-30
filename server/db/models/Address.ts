import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Customer } from './Customer';
import { Orders } from './Orders';

@Table({
  tableName: 'address',
  timestamps: false,
})
export class Address extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  address_id!: number;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer_id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  street_line?: string;

  @Column(DataType.STRING(100))
  commune?: string;

  @Column(DataType.STRING(100))
  district!: string;

  @Column(DataType.STRING(100))
  province!: string;

  @Column(DataType.TEXT)
  google_map_link?: string;

  @BelongsTo(() => Customer, { onDelete: 'CASCADE' })
  customer!: Customer;

  @HasMany(() => Orders)
  orders!: Orders[];
}