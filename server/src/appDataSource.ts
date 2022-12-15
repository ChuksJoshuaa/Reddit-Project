import { DataSource } from "typeorm";
import "dotenv-safe/config";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Updoot } from "./entities/Updoot";
import path from "path";
import { __prod__ } from "./constant";

let portNumber = Number(process.env.DATABASE_PORT);

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: portNumber,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME_PREFIX,
  synchronize: !__prod__,
  logging: !__prod__,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, User, Updoot],
});
