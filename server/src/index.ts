import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import { __prod__ } from "./constant";
import { Post } from "./entities/Post";
import "dotenv-safe/config";

const main = async () => {
  // const orm = await MikroORM.init({
  //   entities: [Post],
  //   dbName: "reddit-server",
  //   user: "postgres",
  //   password: "3430004",
  //   debug: !__prod__,
  //   type: "postgresql",
  // });
  const orm = await MikroORM.init<MongoDriver>({
    entities: [Post],
    dbName: process.env.DATABASE_NAME,
    clientUrl: process.env.MONGO_URI,
    debug: !__prod__,
    type: "mongo",
  });

  const post = orm.em.create(Post, {
    title: "My first post",
  } as Post);
  await orm.em.persistAndFlush(post);
  console.log("--------------sql 2----------------");
  await orm.em.nativeInsert(Post, { title: "my first post 2" });
  await orm.getSchemaGenerator().createSchema();
};

main().catch((err) => {
  console.log(err);
});
