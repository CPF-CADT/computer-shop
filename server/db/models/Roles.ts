import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, Default, Unique } from 'sequelize-typescript';


@Table({
  tableName: 'roles',
  timestamps: false,
})
export class Roles extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  role_id!: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  role_name!: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;
}
