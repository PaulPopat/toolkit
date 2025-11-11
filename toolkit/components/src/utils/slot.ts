import { IsFunction } from "@toolkit/safe-type";
import { ComponentChildren, h, createContext } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

export function UseSlotChange(handle: (slot: HTMLSlotElement) => undefined | Function | void) {
  const ref = useRef<HTMLSlotElement | null>(null);
  useEffect(() => {
    const current = ref.current;
    if (!current) return;

    let undo: undefined | Function | void = undefined;
    const handler = () => {
      if (IsFunction(undo)) (undo as Function)();
      undo = handle(current);
    };

    handler();

    current.addEventListener("slotchange", handler);
    return () => {
      if (IsFunction(undo)) (undo as Function)();
      current.removeEventListener("slotchange", handler);
    };
  }, [ref.current, handle]);

  return ref;
}

const SlotContext = createContext({
  set_has_children(has_children: boolean) {},
});

export type SlotToggleProps<TTag extends keyof preact.JSX.IntrinsicElements> = {
  tag: TTag;
  children: ComponentChildren;
} & preact.JSX.IntrinsicElements[TTag];

export const SlotToggle = <TTag extends keyof preact.JSX.IntrinsicElements>({
  tag,
  children,
  ...props
}: SlotToggleProps<TTag>) => {
  const [has_children, set_has_children] = useState(false);
  const p = {
    ...props,
    ...(!has_children ? { style: { display: "none" } } : {}),
  };

  return h(SlotContext.Provider, { value: { set_has_children } }, h(tag, p, children));
};

export const Slot = (props: preact.JSX.IntrinsicElements["slot"]) => {
  const { set_has_children } = useContext(SlotContext);
  const ref = UseSlotChange((slot) => set_has_children(!!slot.assignedNodes().length));

  return h("slot", { ...props, ref });
};
