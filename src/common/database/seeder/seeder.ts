import { faker } from '@faker-js/faker';
import { getRepository } from 'typeorm';
import { User } from '../../../modules/user/entities/user.entity';
import { Category } from '../../../modules/category/entities/category.entity';
import { Post } from '../../../modules/post/entities/post.entity';

const categories = [];
const posts = [];

export async function seedRecord() {
  const user = await getRepository(User).save({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'password',
    phone_number: '+23480' + faker.random.numeric(8),
  });

  for (let i = 0; i < 5; i++) {
    const category = {
      name: faker.commerce.department(),
      slug: faker.name.jobArea(),
      userId: user.id,
    };
    categories.push(category);
  }
  await getRepository(Category).insert(categories);
  const savedCategories = await getRepository(Category).find({
    where: { userId: user.id },
  });

  for (let i = 0; i < 50; i++) {
    const post = {
      name: faker.lorem.sentence(),
      text: faker.lorem.paragraphs(),
      userId: user.id,
      categoryId: savedCategories[Math.floor(Math.random() * 5)].id,
    };
    posts.push(post);
  }

  await getRepository(Post).insert(posts);
  return;
}
