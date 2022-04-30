import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "cron_job_log",
})
export class CronJobLog extends Model {

    @Column({ type: DataType.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true})
    id!: string;

    @Column({ type: DataType.STRING, allowNull: true})
    page: string;

    @Column({ type: DataType.STRING, allowNull: true})
    status: string;

    @Column({ type: DataType.STRING, allowNull: true})
    type: string;
}