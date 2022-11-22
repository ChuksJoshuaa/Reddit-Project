import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
// import { Post } from "./entities/Post";
import "dotenv-safe/config";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import session from "express-session";
const RedisStore = connectRedis(session);
import "dotenv-safe/config";
import cors from "cors";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const PORT = process.env.PORT || 5000;
  const secret_key = process.env.SESSION_SECRET;

  const app = express();

  let redisClient = createClient({ legacyMode: true });
  redisClient.connect().catch(console.error);

  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

  app.use(
    session({
      secret: secret_key || "",
      name: process.env.COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      resave: false,
    })
  );

  app.get("/", (_, res) => {
    res.send("hello");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    //plugins eliminate that fancy sandbox playground to use the default one
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}....`);
  });
};

main().catch((err) => {
  console.log(err);
});
