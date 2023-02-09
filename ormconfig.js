// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const SnakeNamingStrategy =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('typeorm-naming-strategies').SnakeNamingStrategy;
module.exports = {
  type: 'postgres',
  url: process.env.POSTGRES_DB_URL,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  migrationsRun: true,
  entities: [join(__dirname, '/dist/models/**.js')],
  migrations: [join(__dirname, '/dist/common/database/migrations/*.{js,ts}')],
  subscribers: [join(__dirname, '/dist/subscribers/**.js')],
  extra: {
    ssl:
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'staging',
  },
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
};
