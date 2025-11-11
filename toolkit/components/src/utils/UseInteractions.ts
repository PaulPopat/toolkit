import type { ComponentBase } from "ComponentBase";
import { UseFocusable } from "./UseFocusable";

export type UseInteractionsProps = {
  cta: () => void;
  focus?: () => void;
};

export function UseInteractions(self: ComponentBase, props: UseInteractionsProps) {
  UseFocusable(self, 0);

  self.use_event(
    "click",
    (e) => {
      e.preventDefault();
      props.cta();
    },
    [props.cta]
  );

  self.use_event(
    "keydown",
    (e) => {
      if (!(e instanceof KeyboardEvent)) return;
      if (e.key !== "Enter") return;
      e.preventDefault();
      props.cta();
    },
    [props.cta]
  );

  self.use_event(
    "focus",
    () => {
      if (props.focus) props.focus();
    },
    [props.focus]
  );
}
