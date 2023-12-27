# dycraft 🌈

[![npm version][npm-version-src]][npm-version-href]
[![npm version][codecov-src]][codecov-href]
[![Master Workflow][workflow-src]][workflow-href]
[![Known Vulnerabilities][snyk-src]][snyk-href]
[![Conventional Commits][conventional-src]][conventional-href]

This is a versatile package for dynamically shaping objects.
It seamlessly integrates **default** values and **getters**,
providing a flexible way to tailor objects based on specific requirements.

**Table of Contents**
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install dycraft --save
```

## Usage

### Defaults

```typescript
import { dycraft } from 'dycraft';

type Options = {
    foo: string,
    bar: string
};

type OptionsInput = Partial<Options>;

const data : OptionsInput = {
    foo: 'bar'
};

const record = dycraft({
    data,
    defaults: {
        foo: 'baz',
        bar: 'boz'
    }
});

console.log(record.foo);
// bar

console.log(record.bar);
// boz

delete record.foo;

console.log(record.foo);
//baz
```

### Getters

```typescript
import { dycraft } from 'dycraft';

type Options = {
    foo: string,
    bar: string
};

type OptionsInput = Partial<Options>;

const record = dycraft({
    data: {
        foo: 'bar',
    } as OptionsInput,
    getters: {
        bar: defineGetter((context) : string => {
            if (context.has('foo')) {
                return context.get('foo');
            }

            return 'baz';
        }),
    },
});

console.log(record.foo);
// bar
console.log(record.bar);
// bar

delete record.foo;

console.log(record.foo);
// undefined
console.log(record.bar);
// baz
```

## Contributing

Before starting to work on a pull request, it is important to review the guidelines for
[contributing](./CONTRIBUTING.md) and the [code of conduct](./CODE_OF_CONDUCT.md).
These guidelines will help to ensure that contributions are made effectively and are accepted.

## License

Made with 💚

Published under [MIT License](./LICENSE).

[npm-version-src]: https://badge.fury.io/js/dycraft.svg
[npm-version-href]: https://npmjs.com/package/dycraft
[codecov-src]: https://codecov.io/gh/Tada5hi/dycraft/branch/master/graph/badge.svg?token=4KNSG8L13V
[codecov-href]: https://codecov.io/gh/Tada5hi/dycraft
[workflow-src]: https://github.com/Tada5hi/dycraft/workflows/CI/badge.svg
[workflow-href]: https://github.com/Tada5hi/dycraft
[snyk-src]: https://snyk.io/test/github/Tada5hi/dycraft/badge.svg?targetFile=package.json
[snyk-href]: https://snyk.io/test/github/Tada5hi/dycraft?targetFile=package.json
[conventional-src]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white
[conventional-href]: https://conventionalcommits.org
