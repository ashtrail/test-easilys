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
```

Copy `.env.example` in the root folder, rename it `.env` and fill in the missing and/or incorrect fields. Then add a symbolic link to it in the API folder.

```
> cd api
> ln -s ../.env .env
```

## Usage

You can start the API with `yarn start`

```
> cd api
> yarn start
```

You can also use :

- `yarn lint` to lint the javascript files in the API with eslint.
- `yarn test` to launch the test suite with jest.

## Choices and conception

I decided to use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for consistency and clarity.

I took some inspiration from Socket.io's documentation and tutorials, like the [basic CRUD example](https://github.com/socketio/socket.io/tree/master/examples/basic-crud-application), for the general architecture of the api and client as well as for testing strategies.

### Packages Used

The API has the following dependencies :

- [Socket.io](https://socket.io/) as the socket library.
- [dotenv](https://github.com/motdotla/dotenv) to load the environment configuration.

I used these packages for development :

- [nodemon](https://github.com/remy/nodemon) in order to restart the app when a file has changed.
- [jest](https://jestjs.io/) and [supertest](https://github.com/visionmedia/supertest) for testing.
- [eslint](https://github.com/eslint/eslint) for linting.
- [prettier](https://github.com/prettier/prettier) for code formatting.
