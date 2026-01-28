
export type GetApiParamsTypeBase<TFn,TKey extends string> = TFn extends (params: { [K in TKey]: infer TParams }) => any ? TParams : never;
export type GetApiQueryParamsType<TFn> = GetApiParamsTypeBase<TFn, 'query'>;
export type GetApiBodyQueryParamsType<TFn> = GetApiParamsTypeBase<TFn, 'body'>;
export type GetApiPathParamsType<TFn> = GetApiParamsTypeBase<TFn, 'path'>;


export type GetFirstParamsType<TFn> = TFn extends (params: infer TParams) => any ? NonNullable<TParams> : never;