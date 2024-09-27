import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "./entity/User";
import { Trademark } from "./entity/Trademark";
import { History } from "./entity/History";
import { Data } from "./entity/Data";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.DB_PASS,
  database: "brandgain",
  synchronize: true,
  logging: false,
  entities: [Users, Trademark, History, Data],
  migrations: ["src/migration/*"],
  subscribers: [],
});
