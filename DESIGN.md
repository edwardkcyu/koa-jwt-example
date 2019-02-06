# Design Principle

## LIBRARIES

### 1. [Koa](https://koajs.com/) - Web application framework

Considering the most popular framework Express, Koa is also created by the same author, the famous developer, [TJ Holowaychuk](https://github.com/tj) ( sadly he has already left Node.js to the Go world).

I personally consider Koa as the next generation of Express. The reason for choosing Koa over Express:

- Lighter weight
- Clear and better middleware control
- Slightly better performance
- ES2017 ready

### 2. [Winston](https://github.com/winstonjs/winston) - asynchronous logging

Console.log may affect application perfermance, as it is synchronous when logging to the terminal or a file.
Winston provides an asynchronous logging feature to cater this issue.
Also to standardize the logging format.

### 3. Middlewares

Most middlewares selected here provides zero-configuration usage and add oppionated best practices

- kcors
  - support cross domain access for front end and add security restriction to headers
- koa-bodyparser
  - standardizing the way of getting request body
- koa-helmet
  - add various HTTP headers to secure the apps
- koa-logger
  - a development only middleware for logging
- koa-response-time
  - add the response time to response header for easy performance diagnosis

### 4. [Permit](https://github.com/ianstormtaylor/permit) -

A way to isolate the token extraction logic.
One popular option is to use [Passport](http://www.passportjs.org/), but personally do not like it. Reasons:

- Tightly coupled to Express, not Koa friendly.
- the coding style is callback-based, which I will strictly avoid and prefer async/await style

To standardize the way of getting Bearer token(JWT) from authorization header, no more manual string parsing.
In case the authentication method are changed later, this library also supports

- basic authentication
- token from query string
- token from custom header
- token from cookie (not yet provided this feature, will discuss with the author to create a PR for that)

This is also one of the [Top 45 Node.js libraries in 2018](https://medium.mybridge.co/45-amazing-node-js-open-source-for-the-past-year-v-2019-c774d750e925) selected by Mybridge

### 5. Lodash

Standardize the way of doing common activities. Mostly used for null/undefined checking and picking/omitting fields from an object.

## CODING PRACTICES

### 1. Constants and static data are put inside a `constants` object.

### 2. Error handling

`HttpError` class and `error` middleware are used to centralize error handling.
The idea is to

- avoid too many `try/catch`
- avoid nested `try/catch`
- avoid `else` part from `if/else`
- avoid too much indentation
- extract and put all the error handling logic in a single location

BAD

- handle error one by one

```js
// service-logic.js

try {
  // logic that throw expected or unexpected error
  doBusinessLogicThatMayThrowError();
} catch (e) {
  ctx.status = 500;
  ctx.body = {
    error: {
      // the error content
    }
  };
}

if (!_.isNil(userName)) {
  try {
    // logic that throw expected or unexpected error
    doAnotherBusinessLogicThatMayThrowError();
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      error: {
        // the error content
      }
    };
  }
} else {
  ctx.status = 400;
  ctx.body = {
    error: {
      // the error content
    }
  };
}
```

VS

GOOD

- same way of handling exception cases, just throw an HTTP error
- no more worry for unhandled exception, , error middleware will handle all the rest

```js
// service-logic.js

doBusinessLogicThatMayThrowError();

if (!_.isNil(userName)) {
  throw new HttpError({
    status: 400,
    code: "E001", // for frontend display
    message: "Invalid user name"
  });
}

doAnotherBusinessLogicThatMayThrowError();
```

## UNIT TEST

Unit test is necessary for any application. Among the popular testing libraries, I want to simplify the whole thing with only one library `Jest` for:

- Test runner
- Assertion library
- Auto expected results writer with Snapshot

## End-TO-END TEST

It is also useful to have end-to-end test for a quick integration or regression test. Postman's CLI, [newman](https://github.com/postmanlabs/newman), will be a good fit for this case.

Test cases are created from Postman GUI, and exported as json for running with `yarn`.

## CODING STYLE

To ensure the quality of source code, Eslint and Prettier are used to do code linting and formating.

The configuration are stored inside projects (`.eslintrc` and `.prettierrc`) to make sure everyone will have the same settings

### 1. Eslint

Just add a minimal control, so no error level rules.
Show warning for using `console.log` and `unused variables`.

### 2. Prettier

No more code style arguments between team members, everyone just follow the agreed rules in `.prettierrc`

### 3. Auto linting and formatting on pre-commit

To ensure all commits are in good quality(e.g. linted, formatted, no whitespace-only changes), pre-commit checking is added by libraries `husky` and `lint-staged`

- `husky` is for adding a pre-commit hook
  ```json
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  ```
- `lint-staged` is for running `eslint` and `prettier` during pre-commit
  ```json
  "lint-staged": {
    "*.{js,md}": [
      "prettier --write",
      "git add"
    ],
    "src/**/*.js": [
      "eslint --fix",
      "git add"
    ]
  }
  ```

## DEPLOYMENT

### 1. Docker

`Dockerfile` is provided for building docker image.

- Choosing Node.js version 10 over version 8 as the base image:
  1. Have around 20–40% performance improvement in both parsing and compilation time of JavaScript
  2. Offer async/await and array performance improvements
- Use `alpine` for security reason and lighter weight
- Add `curl` for production analysis
- Add `tzdata` to change the OS timezone to HONG KONG for easier problem diagnosis
- `yarn test --silent` will fail a docker image build if the unit test failed to run
- Single-stage vs multi-stage
  - Compare to Go, Javascript is a runtime language that does not require compilation, so I will prefer to use single stage Dockerfile to build the docker image
  - To demo the idea, multiple-stage commands will be provided as comments in `Dockerfile`

### 2. Kubernetes

The application is Kubernetes ready. Deployment yaml files for different environments are inside `k8s` directory with the necessary produciton-required congiuration

- environment variables for running the applicaiton
- rolling update spec to high availability
- communication between microservices are based on K8S DNS ([serviceName].[namespace].svc.cluster.local) for better security and performance

## DEVELOPMENT FRIENDLY

### 1. Scripts for daily usage

A list of scripts are prepared in package.json to support daily development

- start
  - For running the service in production
- dev
  - For development, use `nodemon` to restart server on code change
- debug / debug:jest
  - Enable debugging features on VS Code
- lint
  - run eslint
- docker:build / docker:push
  - to avoid typo, shorthand for the long `docker build` and `docker push` commands
- test
  - unit test, normally will add `--watch` during development

### 2. Debug ready

Debugging is essential for both application and unit test during development. Corresponding configurations for VS Code are ready to use:

- `launch.json` in _.vscode_
- `debug` and `debug:jest` scripts in _package.json_

### 3. Node version checking

`async/await` pattern is heavily used for my coding pratices and is only officially supported with Node.js 7.6 and later.
A Node.js version checking is added to _package.json_

```json
"engines": {
  "node": ">=8.0.0"
},
```

## FURTHER IMPROVEMENT
### 1. Template tool for K8S deployment yaml
Use Helm to generate the deployment yaml files for differnt environments

### 2. Helm chart for deployment management (Questionable) 
Though Helm has become an official CNCF project and selling its deployment management ability. It's effectiveness and helpfulness are still questionable, can be a good direction to study.

### 3. Typescript for object type checking (Questionable)
Moving to Node.js from Java world, I personally do not like Strong typing languages that require too much boilerplate codes.

However with the overwhelming popularity of Typescript in JS world, there must be some benefits of using it.

That said, I am still favour the clean and officially supported native Node.js coding style, without transpilation (either with Typescript transpiler or Babel). I would prefer using more unit tests for logic checking. 

## CONSIDERATION

### 1. File logs

It is a common practice to write system and audit logs to files with rotation. With microservice architecture using Kubernetes, any log writing to the terminal will be output to file in every Node with path `/var/lib/docker/containers` or `/var/lib/containers`. Therefore, instead of writing file logs, I will prefer simply writing to the `stdout/stderr` and collect the logs with ELK/EFK stack.

### 2. gRPC

gRPC can be a future for microservices communication because of its lightweight-ness, it will be interesting to study the usability in Node.js.

However, there does not seem to be a promising gRPC framework for Node.js. Maybe gRPC is still not mature enough in Node.js ecosystem. (seems better in Go).

Anyway, can be a good direction for the comming study.


