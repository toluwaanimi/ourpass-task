import { AbstractEntity } from '../../../common/database/model/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity('category')
export class Category extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  slug: string;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
