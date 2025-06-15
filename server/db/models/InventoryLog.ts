import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, Default } from 'sequelize-typescript';
import { Product } from './Product';
import { Staff } from './Staff';

@Table({
  tableName: 'inventorylog',
  timestamps: false,
})
export class InventoryLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  log_id!: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  product_code!: string;

  @ForeignKey(() => Staff)
  @Column(DataType.INTEGER)
  staff_id?: number;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  change_date!: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  change_type!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity_change!: number;

  @Column(DataType.TEXT)
  note?: string;

  @BelongsTo(() => Product, { onDelete: 'CASCADE' })
  product!: Product;

  @BelongsTo(() => Staff, { onDelete: 'SET NULL' })
  staff?: Staff;
}