import { ComponentContext } from "WebComponent";
import type { ErrorType } from "./FormDataGatherEvent";
import { IsString } from "@toolkit/safe-type";

function InputStyling($: any, open: boolean, title_colour: string, body_colour: string, error: ErrorType | undefined) {
  return {
    ":host": {
      display: "flex",
      align_items: "center",
      width: "100%",
      position: "relative",
      border_width: $.border_width.body,
      border_style: $.border_style.body,
      border_color: error ? $.border_colour.error : $.border_colour.body,
      box_shadow: $.border_shadow.body,
      border_radius: $.border_radius.body,
      transition: [["box-shadow", $.animation_speed.fast].join(" ")].join(", "),
    },
    ":host(:focus-within),:host(:focus)": {
      box_shadow: $.border_shadow.focus.body,
      outline: "none",
    },
    ".title-text": {
      background: $.background_colour[title_colour],
      color: $.foreground_colour[title_colour],
      border_right_width: open ? $.border_width.body : "0",
      border_right_style: $.border_style.body,
      border_right_color: error ? $.border_colour.error : $.border_colour.body,
      font_family: $.font_family.p,
      font_size: $.font_size.p,
      font_weight: $.font_weight.p,
      text_decoration: $.text_decoration.p,
      padding_top: $.padding.small.body.y.top,
      padding_bottom: $.padding.small.body.y.bottom,
      padding_left: $.padding.small.body.x.left,
      padding_right: $.padding.small.body.x.right,
      border_top_left_radius: $.border_radius.body,
      border_bottom_left_radius: $.border_radius.body,
      border_top_right_radius: open ? "unset" : $.border_radius.body,
      border_bottom_right_radius: open ? "unset" : $.border_radius.body,
      min_width: open ? "0%" : "100%",
      box_sizing: "border-box",
      transition: [
        ["min-width", $.animation_speed.fast].join(" "),
        ["border-radius", $.animation_speed.fast].join(" "),
      ].join(", "),
    },
    ".input": {
      display: "block",
      flex: "1",
      font_family: $.font_family.p,
      font_size: $.font_size.p,
      font_weight: $.font_weight.p,
      text_decoration: $.text_decoration.p,
      border: "none",
      padding_top: open ? $.padding.small.body.y.top : "0",
      padding_bottom: open ? $.padding.small.body.y.bottom : "0",
      padding_left: open ? $.padding.small.body.x.left : "0",
      padding_right: open ? $.padding.small.body.x.right : "0",
      background: $.background_colour[body_colour],
      color: $.foreground_colour[body_colour],
      border_top_right_radius: $.border_radius.body,
      border_bottom_right_radius: $.border_radius.body,
      min_width: "0",
    },
    ".input:focus,.input:focus-visible": {
      border: "none",
      outline: "none",
    },
    ".error": {
      position: "absolute",
      top: "100%",
      left: $.padding.small.body.x.left,
      font_family: $.font_family.small,
      font_size: $.font_size.small,
      font_weight: $.font_weight.small,
      text_decoration: $.text_decoration.small,
      background: $.background_colour.error,
      background_clip: "text",
      color: "transparent",
    },
  };
}

type UseInputStylingProps = {
  use_css: ComponentContext["use_css"];
  use_prop: ComponentContext["use_prop"];
  value: any;
  error: ErrorType | undefined;
  focused: boolean;
};

export function UseInputStyling({ use_css, use_prop, value, error, focused }: UseInputStylingProps) {
  use_css(InputStyling, [
    !!value || focused,
    use_prop("title-colour", IsString, "contrast"),
    use_prop("body-colour", IsString, "feature"),
    error,
  ] as const);
}
