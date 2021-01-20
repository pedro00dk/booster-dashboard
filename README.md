# Booster Dashboard

Small dashboard to show github project metrics.

### Instructions

You may start a local development server with `npm run serve`.

A production build can also be produced with the following command `npm run build`.
The built application will be located at `dist/build`, and may be served by any http server such as nginx.

Both `build` and `serve` scripts require a github personal access token to be provided through the `TOKEN` environment variable.
The github personal access token does not need any access for personal tokens at all.

```shell
$ TOKEN=<personal access token> npm run build
$ TOKEN=<personal access token> npm run serve
```

Tests can be executed by `npm run test`.

### Usage

Not a lot to do, just type the name of a github user or organization in the "Username or Organization" field, the repository name in the field below, and press Enter.
