import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__, COOKIE_NAME } from "./constant";
// import { Post } from "./entities/Post";
import "dotenv-safe/config";
import microConfig from "./mikro-orm.config";
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

import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {
  const orm = await MikroORM.init(microConfig);

  await orm.getMigrator().up();

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
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
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
