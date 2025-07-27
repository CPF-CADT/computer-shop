import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Default, Unique, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { InventoryLog } from './InventoryLog';
import { StaffRole } from './Enums';
@Table({
  tableName: 'staff',
  timestamps: false,
})
export class Staff extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  staff_id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;
  
  @Default(StaffRole.STAFF)
  @Column({
    type: DataType.ENUM(...Object.values(StaffRole)),
    allowNull: false,
  })
  role!: StaffRole;

  @Unique
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  phone_number!: string;

  @Column(DataType.DECIMAL(10, 2))
  salary?: number;

  @Column(DataType.TEXT)
  work_schedule?: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_active!: boolean;

  @Column(DataType.DATEONLY)
  hire_date?: Date;

  @Column(DataType.STRING(100))
  position?: string;

  @ForeignKey(() => Staff)
  @Column(DataType.INTEGER)
  manager_id?: number;

  @BelongsTo(() => Staff, { foreignKey: 'manager_id', onDelete: 'SET NULL' })
  manager?: Staff;
  
  @HasMany(() => Staff, 'manager_id')
  subordinates!: Staff[];

  @HasMany(() => InventoryLog)
  inventory_logs!: InventoryLog[];
}