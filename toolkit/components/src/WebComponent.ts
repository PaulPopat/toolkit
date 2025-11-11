import type { Checker } from "@toolkit/safe-type";
import type { ComponentBase } from "ComponentBase";
import type { CssModel } from "css/CssModel";
import type { JSX } from "preact/jsx-runtime";

export type ComponentContext = {
  self: ComponentBase;
  root: ShadowRoot;
  use_prop: (<T>(key: string, expect: Checker<T>) => T) & (<T>(key: string, expect: Checker<T>, default_value: T) => T);
  use_css: <TArgs extends Array<any>>(factory: ($: any, ...args: TArgs) => CssModel, predicate: TArgs) => void;
  use_send_context: (key: symbol, value: unknown) => void;
  use_context: (<T>(key: symbol, expect: Checker<T>) => T | undefined) &
    (<T>(key: symbol, expect: Checker<T>, default_value: T) => T);
  use_aria: (key: keyof ARIAMixin, value: string) => void;
  use_event: (event: string, handler: (e: Event) => void, predicate: Array<any>, target?: EventTarget) => void;
};

export type WebComponent = (ctx: ComponentContext) => JSX.Element;
