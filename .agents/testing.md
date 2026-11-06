# Testing

`npm test` runs Vitest using `test/vitest.config.mts`. `npm run test:coverage` enables the configured coverage provider and existing thresholds; keep those thresholds and source inclusion rules intact.

Preserve default and getter semantics, including when getters execute and how shaped properties are exposed.

Run the build when changing exported types or bundle configuration. Validate both CommonJS and ESM consumer entrypoints when altering package exports. A missing external service is an incomplete check, not a passing test.
