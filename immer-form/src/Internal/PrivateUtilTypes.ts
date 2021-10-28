

export type ArrayElementIfArray<ArrayType> =
ArrayType extends (infer ElementType)[] ? ElementType : never;

export type KeysWithValue<F, V> = {
    [k in keyof F]: F[k] extends V ? k : never
}[keyof F]

