import { IsString, Optional } from "@toolkit/safe-type";
import { useCallback } from "preact/hooks";
import { FormSubmitEvent } from "shared/form/FormSubmitEvent";
import { UseInteractions } from "utils/UseInteractions";
import { WebComponent } from "WebComponent";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-button": HTMLAttributes & {
        colour?: string;
        href?: string;
        type?: string;
      };
    }
  }
}

export const Component: WebComponent = ({ self, use_css, use_prop }) => {
  use_css(
    ($, colour) => ({
      ":host": {
        display: "inline-block",
        border_width: $.border_width.body,
        border_style: $.border_style.body,
        border_color: $.border_colour.body,
        border_radius: $.border_radius.body,
        box_shadow: $.border_shadow.body,
        padding_top: $.padding.small.body.y.top,
        padding_bottom: $.padding.small.body.y.bottom,
        padding_left: $.padding.small.body.x.left,
        padding_right: $.padding.small.body.x.right,
        background: $.background_colour[colour],
        color: $.foreground_colour[colour],
        cursor: "pointer",
        font_family: $.font_family.p,
        font_size: $.font_size.p,
        font_weight: $.font_weight.p,
        text_decoration: $.text_decoration.p,
        transition: [["filter", $.animation_speed.fast].join(" ")].join(", "),
      },
      ":host(:hover),:host(:focus)": {
        filter: "brightness(0.75)",
        outline: "none",
      },
    }),
    [use_prop("colour", IsString, "contrast")] as const
  );

  const type = use_prop("type", IsString, "button");
  const href = use_prop("href", Optional(IsString));
  const cta = useCallback(() => {
    switch (type) {
      case "submit":
        self.dispatchEvent(new FormSubmitEvent());
      case "anchor":
      default:
        if (href) window.location.href = href;
    }
  }, [href, type, self]);

  UseInteractions(self, { cta });

  return <slot />;
};
