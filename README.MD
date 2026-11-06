<p align="center"><img src=".github/assets/logo.svg" width="144" height="144" alt="dycraft logo" /></p>
<h1 align="center">dycraft</h1>
<p align="center"><strong>Shape an object with live defaults and computed getters.</strong></p>
<p align="center">Read configuration through normal properties while keeping fallback values separate from the original data.</p>
<p align="center">
  <a href="https://www.npmjs.com/package/dycraft"><img src="https://img.shields.io/npm/v/dycraft" alt="npm version" /></a>
  <a href="https://github.com/tada5hi/dycraft/actions"><img src="https://img.shields.io/github/actions/workflow/status/tada5hi/dycraft/main.yml" alt="CI status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/dycraft" alt="License" /></a>
</p>
<p align="center"><a href="#installation">Installation</a> · <a href="#usage">Usage</a> · <a href="#api">API</a> · <a href="#notes">Notes</a></p>

---

## Why dycraft?

Read configuration through normal properties while keeping fallback values separate from the original data.

| Concern | Without it | With it |
|---|---|---|
| Fallback values | Copy defaults into each object | Expose defaults through a Proxy |
| Computed values | Maintain derived fields manually | Evaluate getters on property access |
| Overrides | Coordinate separate lookup helpers | Read own data before getters and defaults |

The dycraft proxy reads an own data property first, otherwise evaluates an enabled getter, otherwise returns an enabled default. Writes go to the original data object.

<img src=".github/assets/mechanism.svg" width="960" alt="The dycraft proxy reads an own data property first, otherwise evaluates an enabled getter, otherwise returns an enabled default. Writes go to the original data object." />

## Installation

```bash
npm install dycraft
```

Requires Node `>=18.0.0`. ESM, CommonJS and TypeScript declarations are included. Import the documented package entrypoint rather than undeclared `dist/` paths.

## Usage

```typescript
import { defineGetter, dycraft } from 'dycraft';

const data = { host: 'localhost' };
const config = dycraft({
    data,
    defaults: { port: 3000 },
    getters: { url: defineGetter(({ get }) => `http://${get('host')}:${get('port')}`) },
});
console.log(config.url); // http://localhost:3000
config.port = 8080;
console.log(config.url); // http://localhost:8080
console.log(data); // { host: 'localhost', port: 8080 }
```

## Options

| `Context` property | Default | Purpose |
|---|---|---|
| `data` | `{}` | Proxy target and destination for writes |
| `defaults` | none | Fallback properties |
| `getters` | none | Functions receiving `{ get, has }` |
| `defaultsGet` / `defaultsHas` | `true` | Enable defaults for reads / existence checks |
| `gettersGet` / `gettersHas` | `true` | Enable getters for reads / existence checks |

Reading a property checks own data, then a getter, then a default. Missing properties return `undefined`. The `in` operator checks enabled data sources without executing getters. `defineGetter(fn)` returns the same function while preserving its inferred return type.

The proxy also exposes experimental `$defaultsGet`, `$defaultsHas`, `$gettersGet` and `$gettersHas` controls through `OutputOptions`.

## API

All names below are exported from `dycraft`. Types have no runtime value.

| Export | Kind | Purpose |
|---|---|---|
| `defineGetter` | function | Return a getter unchanged with its inferred type |
| `dycraft` | function | Create an object proxy over data, getters and defaults |
| `ObjectLiteral` | type | Type contract for object literal |
| `ObjectEmptyLiteral` | type | Type contract for object empty literal |
| `GetterContext` | type | Type contract for getter context |
| `Getter` | type | Type contract for getter |
| `Getters` | type | Type contract for getters |
| `GettersToRecord` | type | Type contract for getters to record |
| `Context` | type | Type contract for context |
| `OutputOptions` | type | Type contract for output options |
| `Output` | type | Type contract for output |

## Notes

- **The proxy shares your data.** Writes update the original `data` object; defaults are not copied into it. An own property containing `undefined` still takes precedence over a getter or default.
- **Getters are not cached.** They run for each access. The supplied context blocks a getter from reading itself directly, but does not detect cycles between different getters.
- **Top-level lookup.** Keys are ordinary property names, not dotted paths. Nested objects are not recursively proxied.
- **Enumeration includes virtual keys.** Default/getter keys are captured when the proxy is constructed. Changing those records later does not refresh that captured key list.
- **Experimental controls.** The four visibility flags are experimental; avoid treating them as a stable serialization or access-control boundary.

## Contributing

Read the [contribution guidelines](CONTRIBUTING.md) and [code of conduct](CODE_OF_CONDUCT.md).

## License

Made with 💚

Published under the [MIT License](LICENSE).
