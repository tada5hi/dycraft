import type { OutputOptionKey } from './constants';

export type ObjectLiteral = Record<string, any>;
export type ObjectEmptyLiteral = Record<string, never>;

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I)=>void) ? I : never;

export type GetterContext = {
    has(key: string) : boolean;
    get(key: string) : any;
};

export type Getter = (context: GetterContext) => any;

export type Getters = {
    [key: string]: Getter
};

export type GettersToRecord<
    T extends ObjectLiteral,
> = {
    [K in keyof T]: T[K] extends Getters ?
        GettersToRecord<T[K]> :
        (T[K] extends (...args: any[]) => infer R
            ? R
            : never)
};

export type Context<
    DATA extends ObjectLiteral = ObjectEmptyLiteral,
    DEFAULT extends ObjectLiteral = ObjectEmptyLiteral,
    GETTERS extends Getters = ObjectEmptyLiteral,
> = {
    data?: DATA,
    defaults?: DEFAULT,
    /**
     *
     * @experimental
     */
    defaultsGet?: boolean,
    /**
     *
     * @experimental
     */
    defaultsHas?: boolean,
    getters?: GETTERS
    /**
     *
     * @experimental
     */
    gettersGet?: boolean,
    /**
     *
     * @experimental
     */
    gettersHas?: boolean
};

export type OutputOptions = Record<`${OutputOptionKey}`, boolean>;

export type Output<
    DATA extends ObjectLiteral = ObjectEmptyLiteral,
    DEFAULT extends ObjectLiteral = ObjectEmptyLiteral,
    GETTERS extends Getters = ObjectEmptyLiteral,
> = UnionToIntersection<DEFAULT | DATA | GettersToRecord<GETTERS> | OutputOptions>;
