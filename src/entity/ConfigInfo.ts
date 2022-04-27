import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "configuration",
})
export class ConfigInfo extends Model {

    @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true})
    id!: string;

    @Column({ type: DataType.DATE, allowNull: true})
    create_at: Date;

    @Column({ type: DataType.STRING, allowNull: true})
    key: string;

    @Column({ type: DataType.STRING, allowNull: true})
    type: string;

    @Column({ type: DataType.DATE, allowNull: true})
    update_at: Date;

    @Column({ type: DataType.STRING, allowNull: true})
    value: string;
}