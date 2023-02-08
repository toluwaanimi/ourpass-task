import { AbstractEntity } from '../../../common/database/model/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ nullable: true })
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  @Index({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  toJSON() {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      phone_number: this.phone_number,
    };
  }
}
