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
Then add a symbolic link to this `.env` file in the api and client folder.

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

I took some inspiration from Socket.io's documentation and tutorials, like the [basic CRUD example](https://github.com/socketio/socket.io/tree/master/examples/basic-crud-application), for the general architecture of the API and client as well as for testing strategies.

### Packages Used

Both the API and the client have the following dependencies :

- [Socket.io](https://socket.io/) as the socket library.
- [dotenv](https://github.com/motdotla/dotenv) to load the environment configuration.

The API uses :

- [node-postgres](https://github.com/brianc/node-postgres) to make PostgreSQL queries.

The client uses :

- [express](https://expressjs.com/) to serve the web page.
- [ejs](https://github.com/tj/ejs) to inject environment variables in the served javascript.

I also used these packages for development :

- [nodemon](https://github.com/remy/nodemon) in order to restart the app when a file has changed.
- [jest](https://jestjs.io/) for testing.
- [eslint](https://github.com/eslint/eslint) for linting.
- [prettier](https://github.com/prettier/prettier) for code formatting.

### Shared Logic

Both apps use eslint and prettier as well as some of the environment variables. In order to keep things DRY and consistent, common files are kept in the project's root and symbolic links that point to them were added in the subfolders.

### API

This is the file organization of the API :

```
├── app.js
├── db.js
├── index.js
├── package.json
├── yarn.lock
├── db
│   ├── seeder.js
│   ├── seeds.js
│   ├── setup.js
│   └── utils.js
├── src
│   ├── formatter.js
│   ├── logger.js
│   └── match
│       ├── match.controller.js
│       ├── match.service.js
│       └── match.validator.js
└── tests
    ├── app.test.js
    └── factory.js
```

In the root, `index.js` creates a socket API with `app.js` and listens on `API_PORT`, `db.js` exposes a customized query function to interact with PostgreSQL.

The `db/` folder contains the different scripts for initializing and seeding the database as well as a couple of database-related helper functions in `utils.js`.

The `tests/` folder contains `factory.js` a simple custom-made factory to simplify the database insertion made in the test file `app.test.js`. Because an API consists mostly of I/O operations and this one is pretty simple, instead of trying to make many pure functions and using unit tests, I focused on making integration tests for every 'endpoint' (i.e. `match:list`, `match:create`, etc.).

Finally, the `src/` folder contains two helper functions: `formatter.js` which ensures a consistent format for the API's responses and `logger.js` for all the logging. I prefer using a component/module architecture (like Angular) to an MVC one, i.e. having files regrouped by context and with explicit file names (e.g. `module/module.controller.js` and `module/module.service.js` ) rather than by categories (e.g.`src/controllers/module.js` and `src/services/module.js`).

The benefits are less apparent with only one table but as the app grows it would help keep things clear. The only module in the app is `match`. It has a service that handles all interactions with the database and a controller which contains the logic behind each 'endpoint'.

The way the socket API works is that for each 'endpoint' it takes in a list of arguments and a callback function from the client. Once it has retrieved the desired data it calls the callback function with said data as its only argument.

So for a simplified example :

```js
socket.on('match:get', async function getOne(matchId, callback) {
  // use the first argument(s) to find the relevant data
  const match = await findMatchWithId(matchId)
  // use the callback with said data
  callback(match)
  // if it makes sense, broadcast the event to all the other clients
})
```

This way of handling sending responses to the client was inspired by Socket.io's documentation as this was actually my first time making a socket-based API in javascript.

### Client

The client has a simpler architecture :

```
.
├── index.js
├── package.json
├── yarn.lock
├── public
│   ├── main.css
│   └── match-manager.js
└── views
    └── index.ejs
```

`index.js` is a very simple express app that serves statically the files in `public/` and renders the ejs template of `views/index.ejs`.

`index.ejs` is basically an index.html file that contains the HTML structure of the app as well as the javascript socket connection to API. I used templating with ejs in order to be able to use environment variables within that javascript (in this case to know on which port to connect to the API).

In the `public/` folder `main.css` contains the styling for the app while `match-manager.js` handles most of the logic of the client.

`MatchManager` is a class that contains an array of matches. It has several methods for modifying the state of that array and upon each change, it displays the new state by updating the HTML. The app is pretty small in scope so I chose to create a new array, clear and rebuild the HTML list every time because it's simpler than the alternative. But it could be optimized to only update the modified sections of the HTML.
