# Test Easilys: BabyFoot Manager

A baby foot match manager.

## Installation

This project requires :

- Node.js >= 14.17.4 (the LTS at the time of creation)

You can easily install that specific version with [nvm](https://github.com/creationix/nvm).

```
> nvm install 14.17.4
> nvm use 14
```

Clone the repo and run yarn to download the dependencies.

```
> cd api
> yarn
> cd ../client
> yarn
```

Copy the `.env.example` file located in the root folder, rename it `.env` and fill in the missing and/or incorrect fields. If you want to see the queries made to the database set `LOG_DB_QUERIES` to `true`.
Then add a symbolic link to this `.env` file in the API and client folder.

```
> cd api
> ln -s ../.env .env
> cd ../client
> ln -s ../.env .env
```

Make sure you have PostgreSQL running then set up the database.

```
> cd api
> yarn db:setup
```

You can seed the database with `yarn db:seed` (if you want to run the tests you'll also have to set up the test database with `yarn db:test:setup`).

**Beware:** calling `yarn db:setup` will drop the database and create it anew so don't use it if you don't want to lose your data.

## Usage

You can start the API and client with `yarn start`

```
> cd api
> yarn start

# in another shell
> cd client
> yarn start
```

The web client will be available at `http://localhost:/CLIENT_PORT`.

You can also use :

- `yarn lint` to lint the javascript files with eslint.
- `yarn test` for the API to launch the test suite with jest.

## Choices and conception

I decided to use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for consistency and clarity.

I took some inspiration from Socket.io's documentation and tutorials, like the [basic CRUD example](https://github.com/socketio/socket.io/tree/master/examples/basic-crud-application), for the general architecture of the api and client as well as for testing strategies.

### Packages Used

The API has the following dependencies :

- [Socket.io](https://socket.io/) as the socket library.
- [dotenv](https://github.com/motdotla/dotenv) to load the environment configuration.
- [node-postgres](https://github.com/brianc/node-postgres) to make PostgreSQL queries.

I used these packages for development :

- [nodemon](https://github.com/remy/nodemon) in order to restart the app when a file has changed.
- [jest](https://jestjs.io/) for testing.
- [eslint](https://github.com/eslint/eslint) for linting.
- [prettier](https://github.com/prettier/prettier) for code formatting.
