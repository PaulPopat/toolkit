import { IsOneOf, Optional } from "@toolkit/safe-type";
import { WebComponent } from "WebComponent";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-row": HTMLAttributes & {
        "no-padding"?: boolean;
        "no-gap"?: boolean;
      };
    }
  }
}

export const Component: WebComponent = ({ use_css, use_prop }) => {
  use_css(
    ($, no_padding, no_gap) => ({
      ":host": {
        display: "grid",
        grid_template_columns: "repeat(12, minmax(0, 1fr))",
        ...(no_padding !== ""
          ? {
              padding_top: $.padding.body.y.top,
              padding_bottom: $.padding.body.y.bottom,
              padding_left: $.padding.body.x.left,
              padding_right: $.padding.body.x.right,
            }
          : {}),
        ...(no_gap !== ""
          ? {
              gap: $.gap,
            }
          : {}),
      },
    }),
    [use_prop("no-padding", Optional(IsOneOf("", "true"))), use_prop("no-gap", Optional(IsOneOf("", "true")))] as const
  );

  return <slot />;
};
