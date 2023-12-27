import { OutputOptionKey } from './constants';
import type {
    Context,
    Getter,
    Getters,
    ObjectEmptyLiteral,
    ObjectLiteral,
    Output,
} from './types';

import { hasOwnProperty } from './utils';

export function dycraft<
    DATA extends ObjectLiteral,
    DEFAULTS extends ObjectLiteral = ObjectEmptyLiteral,
    GETTERS extends Getters = ObjectEmptyLiteral,
>(context: Context<DATA, DEFAULTS, GETTERS> = {}) : Output<DATA, DEFAULTS, GETTERS> {
    const extraKeys: string[] = [];

    if (context.defaults) {
        extraKeys.push(...Object.keys(context.defaults));
    }

    if (context.getters) {
        extraKeys.push(...Object.keys(context.getters));
    }

    let defaultsGet = context.defaultsGet ?? true;
    let defaultsHas = context.defaultsHas ?? true;

    let gettersGet = context.gettersGet ?? true;
    let gettersHas = context.gettersHas ?? true;

    return new Proxy(context.data || {}, {
        ownKeys(_target: Record<string | symbol, any>): ArrayLike<string | symbol> {
            return Array.from(new Set([
                ...Reflect.ownKeys(_target),
                ...extraKeys,
            ]));
        },
        getOwnPropertyDescriptor(target: Record<string | symbol, any>, p: string | symbol): PropertyDescriptor | undefined {
            if (hasOwnProperty(target, p)) {
                return Reflect.getOwnPropertyDescriptor(target, p);
            }

            if (
                (gettersHas && context.getters && hasOwnProperty(context.getters, p)) ||
                (defaultsHas && context.defaults && hasOwnProperty(context.defaults, p))
            ) {
                return {
                    configurable: true,
                    enumerable: true,
                };
            }

            /* istanbul ignore next */
            return undefined;
        },
        set(_target: Record<string | symbol, any>, p: string | symbol, newValue: any): boolean {
            if (p === OutputOptionKey.GETTERS_GET) {
                gettersGet = newValue;
                return true;
            }

            if (p === OutputOptionKey.GETTERS_HAS) {
                gettersHas = newValue;
            }

            if (p === OutputOptionKey.DEFAULTS_GET) {
                defaultsGet = newValue;
            }

            if (p === OutputOptionKey.DEFAULTS_HAS) {
                defaultsHas = newValue;
            }

            _target[p] = newValue;

            return true;
        },
        has(_target: Record<string | symbol, any>, p: string | symbol): boolean {
            if (hasOwnProperty(_target, p)) {
                return true;
            }

            if (
                defaultsHas &&
                context.defaults &&
                hasOwnProperty(context.defaults, p)
            ) {
                return true;
            }

            return !!(gettersHas &&
                context.getters &&
                hasOwnProperty(context.getters, p));
        },
        get(_target: Record<string | symbol, any>, p: string | symbol): any {
            if (p === OutputOptionKey.GETTERS_GET) {
                return gettersGet;
            }

            if (p === OutputOptionKey.GETTERS_HAS) {
                return gettersHas;
            }

            if (p === OutputOptionKey.DEFAULTS_GET) {
                return defaultsGet;
            }

            if (p === OutputOptionKey.DEFAULTS_HAS) {
                return defaultsHas;
            }

            if (hasOwnProperty(_target, p)) {
                return _target[p];
            }

            if (
                gettersGet &&
                context.getters &&
                hasOwnProperty(context.getters, p)
            ) {
                const getter = context.getters[p] as Getter;
                return getter({
                    has: (key) => {
                        if (key === p) {
                            return false;
                        }

                        return this.has ?
                            this.has(_target, key) :
                            false;
                    },
                    get: (key) => {
                        if (key === p) {
                            return undefined;
                        }

                        return this.get ?
                            this.get(_target, key, {}) :
                            undefined;
                    },
                });
            }

            if (
                defaultsGet &&
                context.defaults &&
                hasOwnProperty(context.defaults, p)
            ) {
                return context.defaults[p];
            }

            return undefined;
        },
    }) as Output<DATA, DEFAULTS, GETTERS>;
}
