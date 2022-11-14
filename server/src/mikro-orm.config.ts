import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import "dotenv-safe/config";

//We want the data types to be more specific instead of saying strings for example
export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post],
  dbName: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  debug: !__prod__,
  type: "postgresql",
  allowGlobalContext: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
