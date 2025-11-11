import { CssModel } from "css/CssModel";
import { ModalBase } from "shared/modal/ModalBase";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-offcanvas": HTMLAttributes & {
        hash: string;
        size?: string;
        title?: string;
        body?: string;
      };
    }
  }
}

export const Component = ModalBase(
  ($, open, size): CssModel => ({
    ".modal": {
      display: "flex",
      flex_direction: "column",
      position: "absolute",
      top: "0",
      left: open ? "0" : `-${$.modal.width[size]}`,
      right: "unset",
      bottom: "unset",
      height: "100%",
      max_width: $.modal.width[size],
      max_height: "unset",
      width: "100%",
      margin: "auto",
      border_top: "none",
      border_left: "none",
      border_bottom: "none",
      border_right_width: $.border_width.body,
      border_right_style: $.border_style.body,
      border_right_color: $.border_colour.body,
      padding: "0",
      box_shadow: $.border_shadow.body,
      background: $.background_colour.body,
      color: $.foreground_colour.body,
      overflow: "hidden",
      transition: ["left", $.animation_speed.slow].join(" "),
    },
    [`@media screen and (max-width: ${$.modal.width[size]})`]: {
      ".modal": {
        border: "none",
        height: "100%",
      },
    },
  })
);
