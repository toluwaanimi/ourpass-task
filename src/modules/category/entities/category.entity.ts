import { AbstractEntity } from '../../../common/database/model/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@Entity('category')
export class Category extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  slug: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];

  @ManyToOne(() => User, (user) => user.categories, {
    eager: true,
    nullable: true,
  })
  user: User;

  @Column({ nullable: true })
  userId: string;
}
