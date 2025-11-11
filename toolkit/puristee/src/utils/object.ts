import { IsKeyOf } from "@toolkit/safe-type";

export function Map<T extends Record<string, unknown>>(
  data: T,
  mapper: <TKey extends keyof T>(key: TKey, value: T[TKey]) => T[TKey]
): T {
  const result: any = {};
  for (const key in data)
    if (!IsKeyOf(data, key)) continue;
    else result[key] = mapper(key, data[key]);

  return result;
}
