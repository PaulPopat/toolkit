import { h, render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { WebComponent } from "WebComponent";
import { Assert, Checker, DoNotCare, IsFunction } from "@toolkit/safe-type";
import { Css } from "css/Css";
import { CssModel } from "css/CssModel";
import { DefaultTheme } from "theme/DefaultTheme";
import { ContextChangedEvent, ContextChangedKey } from "./ContextChangedEvent";
import { PropChangedEvent, PropChangedEventKey } from "./PropChangedEvent";
import { ContextEventKey, RequestContextEvent } from "./RequestContextEvent";
import { ThemeKey } from "./ThemeKey";
import { Fetcher } from "theme/Fetcher";

export abstract class ComponentBase extends HTMLElement {
  static #load_timeout: any;

  static #loaded() {
    if (this.#load_timeout) clearTimeout(this.#load_timeout);
    this.#load_timeout = setTimeout(() => {
      document.body.style.opacity = "1";
    }, 50);
  }

  readonly #root = this.attachShadow({ mode: "open" });
  readonly #internals = this.attachInternals();

  abstract readonly Definition: Promise<WebComponent>;

  attributeChangedCallback(name: string) {
    this.dispatchEvent(new PropChangedEvent(name));
  }

  use_event(event: string, handler: (e: Event) => void, predicate: Array<any>, target: EventTarget = this): void {
    useEffect(() => {
      target.addEventListener(event, handler);
      return () => {
        target.removeEventListener(event, handler);
      };
    }, predicate);
  }

  use_prop<T = unknown>(name: string, expect: Checker<T>): T;
  use_prop<T = unknown>(name: string, expect: Checker<T>, default_value: T): T;
  use_prop<T = unknown>(name: string, expect: Checker<T>, default_value?: T): T {
    const [attribute_value, set_attribute_value] = useState(this.getAttribute(name));

    const value = useMemo(() => {
      if (attribute_value?.startsWith(":"))
        return new Function("use_prop", "use_context", ["return", attribute_value.replace(":", "")].join(" "));

      return attribute_value;
    }, [attribute_value]);

    this.use_event(
      PropChangedEventKey,
      (e: Event) => {
        if (!(e instanceof PropChangedEvent) || e.Key !== name) return;

        set_attribute_value(this.getAttribute(name));
      },
      [name]
    );

    const result = useMemo(
      () => (IsFunction(value) ? value(this.use_prop.bind(this), this.use_context.bind(this)) : value) ?? default_value,
      [value, default_value]
    );

    Assert(expect, result);
    return result;
  }

  use_css<TArgs extends Array<any>>(factory: ($: any, ...args: TArgs) => CssModel, predicate: TArgs): void {
    const theme = this.use_context(ThemeKey, DoNotCare, DefaultTheme) as Fetcher;
    const [sheet] = useState(() => {
      const result = new CSSStyleSheet();
      result.replaceSync(new Css(factory(theme(this.tagName.toLocaleLowerCase()), ...predicate)).toString());
      this.#root.adoptedStyleSheets.push(result);
      return result;
    });

    useEffect(() => {
      const css = new Css(factory(theme(this.tagName.toLocaleLowerCase()), ...predicate)).toString();
      sheet.replaceSync(css);
    }, [...predicate, sheet, factory, theme]);
  }

  use_send_context(key: symbol, value: unknown): void {
    this.use_event(
      ContextEventKey,
      (e) => {
        if (!(e instanceof RequestContextEvent) || e.target === this) return;
        e.AddData(key, value);
      },
      [key, value]
    );

    useEffect(() => {
      document.dispatchEvent(new ContextChangedEvent());
    }, [key, value]);
  }

  use_context<T>(key: symbol, expect: Checker<T>): T | undefined;
  use_context<T>(key: symbol, expect: Checker<T>, default_value: T): T;
  use_context<T>(key: symbol, expect: Checker<T>, default_value?: T): T | undefined {
    const get_value = (old?: any) => {
      const event = new RequestContextEvent();
      this.dispatchEvent(event);

      const value = event.Data[key] ?? default_value;
      if (!expect(value)) return undefined;
      return value;
    };

    const [state, set_state] = useState<T | undefined>(get_value);

    this.use_event(
      ContextChangedKey,
      (e: Event) => {
        if (e.target === this) return;
        set_state(get_value);
      },
      [key, set_state],
      document
    );

    return state;
  }

  use_aria(key: keyof ARIAMixin, value: string) {
    useEffect(() => {
      this.#internals[key] = value;
    }, [key, value]);
  }

  connectedCallback() {
    this.Definition.then((d) => {
      render(
        h(d, {
          self: this,
          root: this.#root,
          use_prop: this.use_prop.bind(this),
          use_css: this.use_css.bind(this),
          use_send_context: this.use_send_context.bind(this),
          use_context: this.use_context.bind(this),
          use_aria: this.use_aria.bind(this),
          use_event: this.use_event.bind(this),
        }),
        this.#root
      );
      ComponentBase.#loaded();
    });
  }
}
