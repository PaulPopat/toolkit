import { WebComponent } from "WebComponent";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-buttongroup": HTMLAttributes & {};
    }
  }
}

export const Component: WebComponent = ({ use_css }) => {
  use_css(
    ($) => ({
      ":host": {
        display: "flex",
        align_items: "center",
        justify_content: "flex-start",
      },
      "::slotted(l-button:first-of-type)": {
        border_bottom_left_radius: $.border_radius.body,
        border_top_left_radius: $.border_radius.body,
        border_left_width: $.border_width.body,
        border_left_style: $.border_style.body,
        border_left_color: $.border_colour.body,
      },
      "::slotted(l-button:last-of-type)": {
        border_bottom_right_radius: $.border_radius.body,
        border_top_right_radius: $.border_radius.body,
      },
      "::slotted(l-button)": {
        border_bottom_left_radius: "0",
        border_top_left_radius: "0",
        border_bottom_right_radius: "0",
        border_top_right_radius: "0",
        border_left: "none",
        margin: "0",
      },
    }),
    [] as const
  );

  return <slot />;
};
