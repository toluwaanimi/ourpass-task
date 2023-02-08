import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { IPost } from '../../src/common/interfaces';

export const demoPost: IPost = {
  id: uuidv4(),
  name: faker.name.jobType(),
  text: faker.lorem.paragraph(),
};
export class PostRepositoryMock {
  findOne = jest.fn(() => ({
    id: demoPost.id,
    name: demoPost.name,
    text: demoPost.text,
    toJSON: function () {
      return {
        id: demoPost.id,
        name: demoPost.name,
        text: demoPost.text,
      };
    },
  }));

  update = jest.fn(({}, {}) => ({
    id: uuidv4(),
    name: faker.name.jobArea(),
    slug: faker.name.jobType(),
  }));

  softDelete = jest.fn(({}) => ({}));
}

export class PostServiceMock {
  save() {
    console.log('check me');
  }
}
