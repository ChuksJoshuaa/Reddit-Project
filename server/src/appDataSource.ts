import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Updoot } from "./entities/Updoot";
import path from "path";
import { __prod__ } from "./constant";

let portNumber = Number(process.env.DATABASE_PORT);

export const dataSource = new DataSource({
  type: "postgres",
  port: portNumber,
  url: process.env.DATABASE_URL,
  synchronize: !__prod__,
  logging: !__prod__,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, User, Updoot],
});
