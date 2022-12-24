import { ObjectType, Field } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { Post } from "./Post.entity";

import { User } from "./User.entity";
@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Field()
  @Column({ type: "int" })
  value: number;

  @Field()
  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots)
  user!: User;

  @Field()
  @PrimaryColumn()
  postId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  post!: Post;
}
