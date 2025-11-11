import { Assert, IsFunction, IsInstanceOf, IsObject, IsRecord, IsString, IsUnion, Optional } from "@toolkit/safe-type";
import { ThemeKey } from "ComponentBase/ThemeKey";
import { useEffect, useMemo, useState } from "preact/hooks";
import { default_theme_spec } from "theme/default_theme_spec";
import { Fetcher } from "theme/Fetcher";
import { ThemeSpec } from "theme/ThemeSpec";
import { WebComponent } from "WebComponent";

const ThemeSpecKey = Symbol();

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-theme": HTMLAttributes & {
        from: string;
      };
    }
  }
}

export const Component: WebComponent = ({ use_send_context, use_context, use_prop }) => {
  const down_chain = use_context(ThemeSpecKey, ThemeSpec, default_theme_spec);
  const [spec, set_spec] = useState({} as ThemeSpec);

  const final_state = useMemo(() => ({ ...down_chain, ...spec }), [down_chain, spec]);

  use_send_context(ThemeSpecKey, final_state);

  const from = use_prop("from", Optional(IsUnion(IsInstanceOf(Promise), IsRecord(IsString, IsString))));

  useEffect(() => {
    if (IsInstanceOf(Promise)(from)) {
      from.then(async (r) => {
        Assert(IsObject({ json: IsFunction }), r);
        const body = await r.json();
        Assert(ThemeSpec, body);
        set_spec(body);
      });
    } else {
      Assert(ThemeSpec, from);
      set_spec(from);
    }
  }, [from]);

  const fetcher = useMemo(() => Fetcher(final_state), [final_state]);

  use_send_context(ThemeKey, fetcher);

  return <slot />;
};
