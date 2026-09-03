/**
 * What puts a component's default styles *under* the props a caller passes. It lives in core rather than
 * beside the other object helpers because it reads the prop registry (`pseudo2`) to know which keys carry
 * a nested block — and a util that reaches into core would drag the whole registry into the React package
 * on the other side of the boundary.
 */
export declare function mergeDeep<T>(...objects: T[]): T;
