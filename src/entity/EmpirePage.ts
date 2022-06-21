import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "empire_page",
})
export class EmpirePage extends Model {

    @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true})
    id!: number;

    @Column({ type: DataType.DATE, allowNull: true, field: 'create_at'})
    createAt: Date;

    @Column({ type: DataType.STRING, allowNull: true})
    name: string;

    @Column({ type: DataType.DOUBLE, allowNull: true, field: 'original_price'})
    originalPrice: number;

    @Column({ type: DataType.BIGINT, allowNull: true, field: 'price_by_vnd'})
    priceByVnd: number;

    @Column({ type: DataType.BIGINT, allowNull: true, field: 'item_id'})
    itemId: number;

    @Column({ type: DataType.DOUBLE, allowNull: true, field: 'original_price_not_percentage'})
    originalPriceNotPercentage: number;

    @Column({ type: DataType.BIGINT, allowNull: true, field: 'range'})
    range: number;
}