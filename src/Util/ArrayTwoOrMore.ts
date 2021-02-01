export type ArrayTwoOrMore<T> = [T, T] & T[];

export function isArrayTwoOrMore<T>(value: T[]): value is ArrayTwoOrMore<T> {
  return value?.length > 1;
}
