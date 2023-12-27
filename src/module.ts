import type {
    Context,
    Getter,
    Getters,
    GettersToRecord,
    ObjectEmptyLiteral,
    ObjectLiteral,
    UnionToIntersection,
} from './types';

import { hasOwnProperty } from './utils';

export function dycraft<
    DATA extends ObjectLiteral,
    DEFAULT extends ObjectLiteral = ObjectEmptyLiteral,
    GETTERS extends Getters = ObjectEmptyLiteral,
>(context: Context<DATA, DEFAULT, GETTERS> = {}) : UnionToIntersection<DEFAULT | DATA | GettersToRecord<GETTERS>> {
    const extraKeys: string[] = [];

    if (context.defaults) {
        extraKeys.push(...Object.keys(context.defaults));
    }

    if (context.getters) {
        extraKeys.push(...Object.keys(context.getters));
    }

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
                (context.getters && hasOwnProperty(context.getters, p)) ||
                (context.defaults && hasOwnProperty(context.defaults, p))
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
            _target[p] = newValue;

            return true;
        },
        has(_target: Record<string | symbol, any>, p: string | symbol): boolean {
            if (hasOwnProperty(_target, p)) {
                return true;
            }

            return !!((context.getters && hasOwnProperty(context.getters, p)) ||
                (context.defaults && hasOwnProperty(context.defaults, p)));
        },
        get(_target: Record<string | symbol, any>, p: string | symbol): any {
            if (hasOwnProperty(_target, p)) {
                return _target[p];
            }

            if (
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
                context.defaults &&
                hasOwnProperty(context.defaults, p)
            ) {
                return context.defaults[p];
            }

            return undefined;
        },
    }) as UnionToIntersection<DEFAULT | DATA | GettersToRecord<GETTERS>>;
}
