import { js_string } from "utils/js_string";
import { ThemeSpec } from "./ThemeSpec";

export const IsThemePropertyKey = Symbol();

export function Fetcher(spec: ThemeSpec) {
  const cache: Record<string, string> = {};

  return (component_name: string): any => {
    const create = (search: string) =>
      new Proxy(
        {},
        {
          has(_, p) {
            return p === IsThemePropertyKey;
          },
          get(_, p) {
            if (p === "toString" || p === Symbol.toPrimitive || p === Symbol.toStringTag)
              return () => {
                const cache_key = [component_name, search].join(".");
                if (cache[cache_key]) return cache[cache_key];
                const entries = search.split(".");
                const main_names = [
                  ...entries.reduce((c, n) => [...c, [...c[c.length - 1], n]], [[component_name]]).reverse(),
                  ...entries.reduce((c, n) => [...c, [...c[c.length - 1], n]], [[]] as Array<Array<string>>).reverse(),
                ].map((e) => e.join("."));
                let result = spec[main_names.find((n) => !!spec[n]) ?? ""];
                if (!result)
                  throw new Error(
                    "No Theme Found. This is a bug with components. Looking For:\n" +
                      JSON.stringify(main_names, undefined, 2)
                  );

                if (result.startsWith(":")) result = js_string({ $: create("") }, result);

                cache[cache_key] = result;
                return result;
              };

            if (typeof p !== "string") throw new Error("Invalid property");

            return create([search, p].filter((p) => p).join("."));
          },
        }
      );

    return create("");
  };
}

export type Fetcher = ReturnType<typeof Fetcher>;
