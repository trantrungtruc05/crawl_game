import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "etopfun_page_bk",
})
export class EtopPage extends Model {

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

    @Column({ type: DataType.STRING, allowNull: true})
    category: string;

    @Column({ type: DataType.BIGINT, allowNull: true, field: 'id_item'})
    idItem: number;
}