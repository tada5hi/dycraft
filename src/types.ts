export type ObjectLiteral = Record<string, any>;
export type ObjectEmptyLiteral = Record<string, never>;

export type UnionToIntersection<U> =
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
    getters?: GETTERS
};
