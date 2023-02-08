import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../src/common/interfaces';

export const demoUser: IUser = {
  id: uuidv4(),
  password: '$2a$12$pEZscbgT4vV0Q2Qgz8SDae1REB3cH5B0Fam2IPJuBUoBLdpsXEMeO',
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  phone_number: '+23480' + faker.random.numeric(8),
};
export class UserRepositoryMock {
  findOne = jest.fn(() => ({
    id: demoUser.id,
    password: '$2a$12$pEZscbgT4vV0Q2Qgz8SDae1REB3cH5B0Fam2IPJuBUoBLdpsXEMeO',
    first_name: demoUser.first_name,
    last_name: demoUser.last_name,
    email: demoUser.email,
    phone_number: demoUser.phone_number,
    toJSON: function () {
      return {
        id: demoUser.id,
        first_name: demoUser.first_name,
        last_name: demoUser.last_name,
        email: demoUser.email,
        phone_number: demoUser.phone_number,
      };
    },
  }));

  update = jest.fn(({}, {}) => ({
    id: uuidv4(),
    password: '$2a$12$pEZscbgT4vV0Q2Qgz8SDae1REB3cH5B0Fam2IPJuBUoBLdpsXEMeO',
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    phone_number: '+23480' + faker.random.numeric(8),
  }));
}

export class UserServiceMock {
  save() {
    console.log('check me');
  }
}
