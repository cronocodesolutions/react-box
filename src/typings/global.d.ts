type Maybe<T> = T | undefined;
type Nullable<T> = T | null;

type ArrayType<T> = T extends (infer U)[] ? U : T;
