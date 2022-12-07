import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { User } from "./User";
import { Updoot } from "./Updoot";
@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field()
  @Column()
  authorId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  author!: User;

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();
}
