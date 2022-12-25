import { Authenticated } from "../middleware/Authenticated";
import { MyContext } from "src/types";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Field,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post.entity";
import { dataSource } from "../appDataSource";
import { Updoot } from "../entities/Updoot.entity";
import { User } from "../entities/User.entity";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  description: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  descriptionSnippet(@Root() root: Post) {
    return root.description.slice(0, 100);
  }

  @FieldResolver(() => User)
  author(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    const id = Number(post.authorId);
    return userLoader.load(id);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { updootLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }
    const updoot = await updootLoader.load({
      postId: Number(post.id),
      userId: Number(req.session.userId),
    });

    return updoot ? updoot.value : null;
  }

  @Mutation(() => Boolean)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;

    const updoot = await Updoot.findOne({ where: { postId, userId } });

    if (updoot && updoot.value !== realValue) {
      let realValueDigit = 2 * realValue;
      await dataSource.transaction(async (tm) => {
        await tm.query(
          `
          update updoot     
          set value = $1
          where "postId" = $2 and "userId" = $3
          `,
          [realValue, postId, userId]
        );

        await tm.query(
          `
          update post     
          set points = points + $1
          where id = $2
          `,
          [realValueDigit, postId]
        );
      });
    } else if (!updoot) {
      await dataSource.transaction(async (tm) => {
        await tm.query(
          `
           insert into updoot ("userId", "postId", value)
            values ($1, $2, $3)
        `,
          [userId, postId, realValue]
        );

        await tm.query(
          `
          update post     
          set points = points + $1
          where id = $2
          `,
          [realValue, postId]
        );
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await dataSource.query(
      `
        select p.*
        from post p    
        ${cursor ? `where p."createdAt" < $2` : ""}
        order by p."createdAt" DESC
        limit $1    
    `,
      replacements
    );

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  //Get post by id
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }

  //Create Post
  @Mutation(() => Post)
  @UseMiddleware(Authenticated)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    let authorUserId = req.session.userId;
    return Post.create({ ...input, authorId: authorUserId }).save();
  }

  //Update Post
  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(Authenticated)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("description", () => String, { nullable: true }) description: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    console.log(req.session.userId);
    const result = await dataSource
      .createQueryBuilder()
      .update(Post)
      .set({ title, description })
      .where('id = :id and "authorId" = :authorId', {
        id,
        authorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  //Delete Post
  @Mutation(() => Boolean)
  @UseMiddleware(Authenticated)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id, authorId: req.session.userId });
    return true;
  }
}
