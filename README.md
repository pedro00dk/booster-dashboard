# Booster Dashboard

Small dashboard to show github project metrics.

### Instructions

A local development server can be started with `npm run serve`.

A production build can be created with `npm run build`.
The built application will be located at `dist/build`, and ready to be served by any http server.

Both `build` and `serve` scripts require a github personal access token to be provided through the `TOKEN` environment variable.
The github personal access token does not need access to authorization scopes, it can be a public access token.

```shell
$ TOKEN=<personal access token> npm run build
$ TOKEN=<personal access token> npm run serve
```

Tests can be executed by `npm run test`.

### Usage

Just type the name of a github user or organization in the "Username or Organization" field, the repository name in the field below, and press Enter.
