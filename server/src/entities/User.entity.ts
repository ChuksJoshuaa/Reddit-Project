import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post.entity";
import { Updoot } from "./Updoot.entity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = Date;
}
