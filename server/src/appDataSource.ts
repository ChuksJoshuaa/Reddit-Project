import { DataSource } from "typeorm";
import "dotenv-safe/config";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

let portNumber = Number(process.env.DATABASE_PORT);

console.log(typeof portNumber);

export const dataSource = new DataSource({
  type: "postgres",
  // host: "localhost",
  // port: portNumber,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME_PREFIX,
  synchronize: true, //create a table for you without using a migration
  logging: true,
  entities: [Post, User],
});
