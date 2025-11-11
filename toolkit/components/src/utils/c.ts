import { IsBoolean, IsRecord, IsString, IsTuple, PatternMatch } from "@toolkit/safe-type";
import { Set } from "@toolkit/set";

export function c(...items: Array<string | [string, boolean] | Record<string, boolean>>) {
  return new Set(items)
    .select((i) =>
      PatternMatch(IsString, IsTuple(IsString, IsBoolean), IsRecord(IsString, IsBoolean))(
        (i) => i,
        ([a, b]) => (b ? a : ""),
        (dict) =>
          Set.FromObject(dict)
            .select(([a, b]) => (b ? a : ""))
            .where((a) => !!a)
            .to_array()
            .join(" ")
      )(i)
    )
    .where((i) => !!i)
    .to_array()
    .join(" ");
}
