import { useRef, useState } from "preact/hooks";
import { UseFocusable } from "utils/UseFocusable";
import { ComponentContext } from "WebComponent";

type UseDelegatedFocusProps = {
  self: ComponentContext["self"];
  use_event: ComponentContext["use_event"];
};

export function UseDelegatedFocus<TElement extends HTMLElement>({ self, use_event }: UseDelegatedFocusProps) {
  const ref = useRef<TElement | null>(null);
  const [focused, set_focused] = useState(false);

  UseFocusable(self);

  use_event(
    "focus",
    () => {
      ref.current?.focus();
      set_focused(true);
    },
    [ref]
  );

  use_event(
    "blur",
    () => {
      set_focused(false);
    },
    []
  );

  return { focused, ref };
}
