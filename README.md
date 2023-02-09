# OurPass Task

## Documentation of OurPass Task

## Author 🚀

> ADEBAYO EMMANUEL TOLUWANIMI
---

## Technologies

- Node JS
- NestJS
- Typeorm
- Docker
- Redis

---

## Database

- [Postgres](https://www.postgresql.org/) (TypeORM)

---

## Install NodeJS

To Install NodeJS, kindly go to [Nodejs](https://nodejs.com) and follow the necessary instructions required depending on
your PC Operating System

## MACOS

using a [package](https://nodejs.org/en/#download) simply download the installer

using [homebrew](https://github.com/Homebrew/legacy-homebrew)

```markdown
brew install node
```

---

## Windows

using a [package](https://nodejs.org/en/#download) simply download the installer

using [chocolatey](http://chocolatey.org/) to install Node

```markdown
cinst nodejs
```

---

## To install Postgres

For Windows users, you can kindly follow this
tutorials [here](https://learnsql.com/blog/how-to-install-postgresql-on-windows-in-5-minutes/) to install Postgres on
your local PC which explains how to create a database

For Mac users, you can kindly follow this tutorials [here](https://www.robinwieruch.de/postgres-sql-macos-setup)  to
install Postgres on your local PC which explains how to create a database


---

## Setup Database

To setup your database for the project, after creation kindly open the app.module.ts file in the  folder of the
project and replace with your credentials

```markdown
  ... 
   url: db url here,
```

### OR

Create a .env file in the root directory and add your database details. It should have the following properties

```markdown
PORT=4000
POSTGRES_DB_URL=postgres://localhost/ourpass_task

REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=JWT_SECRET
JWT_REFRESH_SECRET=JWT_REFRESH_SECRET
JWT_SECRET_EXPIRES=3600


NODE_TLS_REJECT_UNAUTHORIZED=0
TEST_DB_URL=postgres://localhost/test
```

Kindly replace these values with the appropriate values based on your Database environment
---

## Start Development

Kindly clone the repo `https://github.com/toluwaanimi/ourpass-task.git`

### Installation

To install the necessary packages, in your folder directory kindly run

```markdown
npm i

# or

yarn add
```

* To continuously watch for changes
    * ```markdown 
      npm run dev
      ```

* To build your app for production
    * ```markdown
      npm run build
         ```


* To run your app server for production
    * ```markdown
      npm run start
         ```

* To run your E2E Test
    * ```markdown
      npm run test:e2e
         ```



* To run your Test
    * ```markdown
      npm run test
         ```

---

## Implementation Required
The Documentation can be found at /docs
# Docker Image

To run a docker image of Postgres and Redis
```text
  docker-compose up
```




