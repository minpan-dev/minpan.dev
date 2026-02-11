export type GroupKey = string | number | symbol;

export interface GroupFunction<T> {
  (item: T, index?: number): GroupKey;
}
