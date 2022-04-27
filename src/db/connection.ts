import { Sequelize } from "sequelize-typescript";
import { ConfigInfo } from "../entity/ConfigInfo";
import { EmpirePage } from "../entity/EmpirePage";
import { BuffPage } from "../entity/BuffPage";


const connection = new Sequelize({
  dialect: "postgres",
  host: "35.213.181.248",
  username: "tructran",
  password: "652606",
  database: "crawl",
  logging: false,
  models: [ConfigInfo, EmpirePage, BuffPage],
});

export default connection;