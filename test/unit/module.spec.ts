/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { defineGetter, dycraft } from '../../src';

type FooRecord = {
    foo?: string,
    bar?: string
};

describe('src/defaults', () => {
    it('should use and overwrite defaults', () => {
        const record = dycraft({
            defaults: {
                foo: 'bar',
            },
        });

        expect(record.foo).toEqual('bar');

        record.foo = 'baz';

        expect(record.foo).toEqual('baz');
    });

    it('should use getters with context', () => {
        const record = dycraft({
            data: {
                foo: 'bar',
            } as FooRecord,
            getters: {
                bar: defineGetter((context) : string => {
                    if (context.has('foo')) {
                        return context.get('foo');
                    }

                    if (context.has('invalidKey')) {
                        return context.get('invalidKey');
                    }

                    return context.get('invalidKey') ?? 'baz';
                }),
            },
        });

        expect(record.foo).toEqual('bar');
        expect(record.bar).toEqual('bar');

        delete record.foo;

        expect(record.foo).toBeUndefined();
        expect(record.bar).toEqual('baz');
    });

    it('should not access same key via getter', () => {
        const record = dycraft({
            getters: {
                foo: defineGetter((context) : string => {
                    if (context.has('foo')) {
                        return context.get('foo');
                    }

                    return context.get('foo');
                }),
            },
        });

        expect('foo' in record).toBeTruthy();
        expect(record.foo).toBeUndefined();
    });

    it('should extend object keys', () => {
        const record = dycraft({
            defaults: {
                foo: 'bar',
            },
            getters: {
                boo: () => 'baz',
            },
        });

        let keys = Object.keys(record);
        expect(keys).toEqual(['foo', 'boo']);

        record.bar = 'baz';

        keys = Object.keys(record);
        expect(keys).toEqual(['bar', 'foo', 'boo']);

        delete record.bar;

        keys = Object.keys(record);
        expect(keys).toEqual(['foo', 'boo']);
    });
});
