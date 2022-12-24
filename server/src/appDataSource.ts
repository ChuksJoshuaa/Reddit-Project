import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
import { Post } from "./entities/Post.entity";
import { User } from "./entities/User.entity";
import { Updoot } from "./entities/Updoot.entity";
import path from "path";
import { __prod__ } from "./constant";

let portNumber = Number(process.env.DATABASE_PORT);

export const dataSource = new DataSource({
  type: "postgres",
  port: portNumber,
  url: process.env.DATABASE_URL,
  ssl: __prod__ ? true : false,
  synchronize: !__prod__,
  logging: !__prod__,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [Post, User, Updoot],
});
