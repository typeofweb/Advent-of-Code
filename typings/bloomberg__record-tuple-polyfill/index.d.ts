declare module '@bloomberg/record-tuple-polyfill' {
  type Tuple<T extends readonly unknown[]> = T & { _tag: 'Tuple' };
  export function Record<T>(t: T): T;
  export function Tuple<T extends readonly unknown[]>(...ts: T): Tuple<T>;
}
