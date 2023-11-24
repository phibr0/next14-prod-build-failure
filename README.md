# Production Build Failure in Next.js 14 with Temporal

https://github.com/vercel/next.js/issues/58870

## Overview:

Projects using Temporal experience production build failures after updating to
Next.js 14.

Issue was observed between `v13.4.20-canary.19` and `v13.5.4-canary.8`, again failing since `v14.0.2-canary.19`. See [results.csv](./results.csv)

## Symptoms:

- The project compiles and typechecks successfully.
- An error occurs during the collection of page data in production builds.

## Error encountered:

```
TypeError: Cannot read properties of undefined (reading 'api')
    at 3290 (/xxx/.next/server/app/api/route.js:35:50001)
    at t (/xxx/.next/server/webpack-runtime.js:1:128)
```

## Observations:

- The issue does not appear in Next.js 13.5.6.
- Development builds and builds using Turbopack
  (`next build --experimental-turbopack`) function normally.
- The problem seems related to webpack.

## Reproduce:

### Prod builds

1. Run `pnpm compare`
   - This command will first install next@13.5.6 and perform a build.
   - Then, it attempts to build using next@latest and next@canary versions to
     compare the outcomes.

### Dev builds

1. `pnpm i`
2. [Install Temporal](https://learn.temporal.io/getting_started/typescript/dev_environment/#set-up-a-local-temporal-development-cluster)
3. `temporal server start-dev`
4. (in another terminal) `pnpm dev`

This will start the next dev server and uses tsc in watch mode to rebuild the
worker.
