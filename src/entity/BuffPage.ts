import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "buff_page_bk",
})
export class BuffPage extends Model {

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

    @Column({ type: DataType.BIGINT, allowNull: true, field: 'original_price_by_vnd'})
    originalPriceByVnd: number;

    @Column({ type: DataType.STRING, allowNull: true})
    category: string;

    @Column({ type: DataType.DOUBLE, allowNull: true, field: 'origin_buff_sell_price'})
    originBuffSellPrice: number;

    @Column({ type: DataType.BIGINT, allowNull: true, field: 'buff_sell_price_vnd'})
    buffSellPriceVnd: number;
}