import "reflect-metadata";

import { __prod__, COOKIE_NAME } from "./constant";
import "dotenv-safe/config";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
const RedisStore = connectRedis(session);
import "dotenv-safe/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { DataSource } from "typeorm";

import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const main = async () => {
  let portNumber = Number(process.env.DATABASE_PORT);

  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: portNumber,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME_PREFIX,
    synchronize: true, //create a table for you without using a migration
    logging: true,
    entities: [Post, User],
  });

  console.log(AppDataSource);

  const PORT = process.env.PORT || 5000;
  const secret_key = process.env.SESSION_SECRET;

  const app = express();

  app.use(cookieParser());

  const redis = new Redis();
  // const redis = new Redis.Cluster([]);

  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

  app.use(
    session({
      secret: secret_key || "",
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis as any,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: false,
        sameSite: "lax",
        secure: __prod__,
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

    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          "request.credentials": "include",
        },
      }),
    ],
    context: ({ req, res }) => ({ req, res, redis }),
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
