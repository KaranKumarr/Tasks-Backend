import { join } from "path";
import { DataSource } from "typeorm";
import "dotenv/config";

export const myDataSource = new DataSource({
  type: "postgres",
  host: process.env["ORMCONFIG_HOST"],
  port: Number(process.env["ORMCONFIG_PORT"]),
  username: process.env["ORMCONFIG_USERNAME"],
  password: process.env["ORMCONFIG_PASSWORD"],
  database: process.env["ORMCONFIG_DATABASE"],
  entities: [join(__dirname, "**", "*.entity.{ts,js}")],
  logging: false,
  synchronize: true,
});
