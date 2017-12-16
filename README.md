# A Simple Nodejs API
A serverless microservice to demonstrate json-patch, image resizing 
and jwt authentication and authorization usage in nodejs.

## Features

- Login to obtain a JWT token
- JSON patch to apply patches to a JSON object payload
- Image resize to resize an image to a thumbnail size of 50x50

## Technologies

- [Express.js](https://expressjs.com/) as the web framework.
- ES2017+ support with [Babel](https://babeljs.io/).
- Automatic polyfill requires based on environment with [babel-preset-env](https://github.com/babel/babel-preset-env).
- Linting with [ESLint](http://eslint.org/).
- Testing with [Mocha](https://mochajs.org/).

## Getting started

```sh
# Clone the project
git clone git@github.com:sauban/simple-resize-api.git
cd simple-api

# Install dependencies
npm install

```

Then you can start the application:

```sh
npm start
```

This will launch a [nodemon](https://nodemon.io/) process for automatic server restarts when your code changes.

### Testing

Testing is powered by [Mocha](https://mochajs.org/). This project also uses [supertest](https://github.com/visionmedia/supertest) for demonstrating a simple routing smoke test suite.

Start the test runner in watch mode with:

```sh
npm test
```

You can also generate coverage with:

```sh
npm run coverage
```

### Linting

Linting is set up using [ESLint](http://eslint.org/). It uses ESLint's default [eslint:recommended](https://github.com/eslint/eslint/blob/master/conf/eslint.json) rules. Feel free to use your own rules and/or extend another popular linting config (e.g. [airbnb's](https://www.npmjs.com/package/eslint-config-airbnb) or [standard](https://github.com/feross/eslint-config-standard)).

Begin linting in watch mode with:

```sh
npm run lint
```

To begin linting and start the server simultaneously, edit the `package.json` like this:

```md
"dev": "nodemon src/index.js --exec \"node -r dotenv/config -r babel-register\" | npm run lint"
```

### Environmental variables in development

The project uses [dotenv](https://www.npmjs.com/package/dotenv) for setting environmental variables during development. Simply copy `.env.example`, rename it to `.env` and add your env vars as you see fit. 

It is **strongly** recommended **never** to check in your .env file to version control. It should only include environment-specific values such as database passwords or API keys used in development. Your production env variables should be different and be set differently depending on your hosting solution. `dotenv` is only for development.

### License

MIT License. See the [LICENSE](LICENSE) file.
