import type { ComponentBase } from "ComponentBase";
import { useEffect } from "preact/hooks";

export function UseFocusable(self: ComponentBase, tab_index = 0) {
  useEffect(() => {
    self.tabIndex = tab_index;
  }, [tab_index]);
}

export function UseInert(self: ComponentBase, is_inert: boolean) {
  useEffect(() => {
    self.inert = is_inert;
  }, [is_inert]);
}
