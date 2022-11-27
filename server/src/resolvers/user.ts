import {
  Resolver,
  Field,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import "dotenv-safe/config";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constant";
import { validateRegister } from "../../utils/validateRegister";
import { UserPasswordInput } from "../../utils/UserPasswordInput";
import { sendEmail } from "../../utils/sendEmail";
import { v4 } from "uuid";
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

//ObjectionType we use it for mutations
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
    if (user === null || user === undefined || !user) {
      //the email is not in the database
      return true;
    }

    let token = v4(); //it will generate a random string

    let expireDate = 1000 * 60 * 60 * 24 * 3;

    await redis.set(
      `${FORGET_PASSWORD_PREFIX}${token}`,
      user.id,
      "EX",
      `${expireDate}`
    );
    const textMessage = `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`;
    await sendEmail(email, textMessage);
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // you are not logged in

    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    // const user = em.create(User, {
    //   username: options.username,
    //   password: hashedPassword,
    // } as User);

    let user;

    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          email: options.email,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      user = result[0];
      // await em.persistAndFlush(user);
    } catch (error) {
      if (error.code === "23505" || error.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }
    }

    //store user id session
    //this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    //reason we retured user in a response object is cuz of the UserResponse we used instead of User
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (
      email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ) === null
    ) {
      return {
        errors: [
          {
            field: "email",
            message: "Please provide a valid email",
          },
        ],
      };
    }
    const user = await em.findOne(User, { email: email });

    if (user === null || user === undefined || !user) {
      return {
        errors: [
          {
            field: "email",
            message: "user does not exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    //We used New Promise because this is a callback
    return new Promise((resolve) =>
      //clear the session from Redis
      req.session.destroy((err) => {
        //Clears the cookie from the browser
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
