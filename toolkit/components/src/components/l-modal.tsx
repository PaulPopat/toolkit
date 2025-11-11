import { CssModel } from "css/CssModel";
import { ModalBase } from "shared/modal/ModalBase";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-modal": HTMLAttributes & {
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
      top: open ? "0" : "-100px",
      left: "0",
      bottom: "0",
      right: "0",
      height: $.modal.height[size],
      max_width: $.modal.width[size],
      width: "100%",
      margin: "auto",
      border_width: $.border_width.body,
      border_style: $.border_style.body,
      border_color: $.border_colour.body,
      border_radius: $.border_radius.body,
      box_shadow: $.border_shadow.body,
      background: $.background_colour.body,
      color: $.foreground_colour.body,
      padding: "0",
      overflow: "hidden",
      transition: ["top", $.animation_speed.slow].join(" "),
    },
    [`@media screen and (max-width: ${$.modal.width[size]})`]: {
      ".modal": {
        border: "none",
        height: "100%",
        border_radius: "0",
        top: "0",
      },
    },
  })
);
