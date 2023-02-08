import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { ICategory } from '../../src/common/interfaces';

export const demoCategory: ICategory = {
  id: uuidv4(),
  name: faker.name.jobArea(),
  slug: faker.name.jobType(),
};
export class CategoryRepositoryMock {
  findOne = jest.fn(() => ({
    id: demoCategory.id,
    name: demoCategory.name,
    slug: demoCategory.slug,
    toJSON: function () {
      return {
        id: demoCategory.id,
        name: demoCategory.name,
        slug: demoCategory.slug,
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

export class CategoryServiceMock {
  save() {
    console.log('check me');
  }
}
