import { IsInstanceOf, IsOneOf, IsString, Optional } from "@toolkit/safe-type";
import { useEffect, useRef, useState } from "preact/hooks";
import { WebComponent } from "WebComponent";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-accordion": HTMLAttributes & {
        open?: boolean;
        isolated?: boolean;
        "title-colour"?: string;
      };
    }
  }
}

const AccordionOpenedEventKey = "AccordionOpened";

class AccordionOpenedEvent extends Event {
  readonly #target: HTMLElement;
  constructor(target: HTMLElement) {
    super(AccordionOpenedEventKey, {
      bubbles: false,
      cancelable: false,
      composed: false,
    });

    this.#target = target;
  }

  get Target() {
    return this.#target;
  }
}

export const Component: WebComponent = ({ self, use_css, use_aria, use_prop, use_event }) => {
  const open_prop = use_prop("open", Optional(IsOneOf("", "true")));
  const isolated = use_prop("isolated", Optional(IsOneOf("", "true")));
  const [open, set_open] = useState(typeof open_prop === "string");
  const body = useRef<HTMLDivElement | null>(null);
  const [body_height, set_body_height] = useState(0);

  useEffect(() => {
    set_open(typeof open_prop === "string");
  }, [open_prop]);

  use_event(
    AccordionOpenedEventKey,
    (e) => {
      if (typeof isolated === "string") return;
      if (!IsInstanceOf(AccordionOpenedEvent)(e)) return;
      set_open(e.Target === self);
    },
    [set_open, isolated],
    self.parentElement ?? self
  );

  useEffect(() => {
    const current = body.current;
    if (!current) return;
    const ob = new ResizeObserver(() => set_body_height(current.clientHeight));
    ob.observe(current);

    return () => {
      ob.unobserve(current);
    };
  }, [body.current]);
  const title_colour = use_prop("title-colour", IsString, "contrast");

  use_css(
    ($, open, title_colour) => ({
      ":host": {
        display: "block",
        border_width: $.border_width.body,
        border_style: $.border_style.body,
        border_color: $.border_colour.body,
        box_shadow: $.border_shadow.body,
        border_bottom: "none",
        overflow: "hidden",
      },
      ":host(:first-of-type)": {
        border_top_left_radius: $.border_radius.body,
        border_top_right_radius: $.border_radius.body,
      },
      ":host(:last-of-type)": {
        border_bottom_left_radius: $.border_radius.body,
        border_bottom_right_radius: $.border_radius.body,
        border_bottom_width: $.border_width.body,
        border_bottom_style: $.border_style.body,
        border_bottom_color: $.border_colour.body,
      },
      ".body": {
        transition: ["height", $.animation_speed.fast].join(" "),
        height: open ? body_height.toString() + "px" : "0",
        overflow: "hidden",
      },
      ".title": {
        display: "flex",
        align_items: "center",
        justify_content: "space-between",
        padding_top: $.padding.body.y.top,
        padding_bottom: $.padding.body.y.bottom,
        padding_left: $.padding.body.x.left,
        padding_right: $.padding.body.x.right,
        font_family: $.font_family.p,
        font_size: $.font_size.p,
        font_weight: $.font_weight.p,
        text_decoration: $.text_decoration.p,
        background: $.background_colour[title_colour],
        color: $.foreground_colour[title_colour],
        cursor: "pointer",
        ...(open
          ? {
              border_bottom_width: $.border_width.body,
              border_bottom_style: $.border_style.body,
              border_bottom_color: $.border_colour.body,
            }
          : {}),
        transition: ["filter", $.animation_speed.fast].join(" "),
      },
      ".body-content": {
        padding_top: $.padding.body.y.top,
        padding_bottom: $.padding.body.y.bottom,
        padding_left: $.padding.body.x.left,
        padding_right: $.padding.body.x.right,
        background: $.background_colour.body,
        color: $.foreground_colour.body,
      },
      ".title:hover,.title:focus": {
        filter: "brightness(0.75)",
        outline: "none",
      },
    }),
    [open, title_colour] as const
  );

  use_aria("role", "dialog");

  return (
    <>
      <div
        class="title"
        tabIndex={0}
        onClick={() => self.parentElement?.dispatchEvent(new AccordionOpenedEvent(self))}
        onFocus={() => self.parentElement?.dispatchEvent(new AccordionOpenedEvent(self))}
      >
        <slot name="title" />
        <l-icon name={open ? "arrow-up-wide" : "arrow-down-wide"} colour={title_colour} tag="p" text />
      </div>
      <div class="body" inert={!open} aria-hidden={open ? "false" : "true"}>
        <div class="body-content" ref={body}>
          <slot />
        </div>
      </div>
    </>
  );
};
