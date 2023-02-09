import { AbstractEntity } from '../../../common/database/model/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import { JoinColumn } from 'typeorm';

@Entity('posts')
export class Post extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  text: string;

  @ManyToOne(() => Category, (category) => category.posts, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  userId: string;
}
