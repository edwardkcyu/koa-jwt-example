# Hello Service

## Usage

### PRODUCTION START

```
yarn start
```

### DEVELOPMENT START

```
yarn dev
```

### UNIT TEST

```
yarn test
```

### BUILD DOCKER IMAGE

```
yarn docker:build
```

### PUSH DOCKER IMAGE

```
yarn docker:push
```

### Environment Configuration

You can use `.env` file, to configure project like this:

```
NODE_ENV=development
PORT=6020
AUTH_SERVICE_URL=http://localhost:6010
```
