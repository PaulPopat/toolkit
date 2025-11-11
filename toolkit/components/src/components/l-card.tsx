import { IsString } from "@toolkit/safe-type";
import { Slot, SlotToggle } from "utils/slot";
import { WebComponent } from "WebComponent";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-card": HTMLAttributes & {
        "title-colour"?: string;
        "body-colour"?: string;
      };
    }
  }
}

export const Component: WebComponent = ({ use_css, use_prop }) => {
  use_css(
    ($, title_colour, body_colour) => ({
      ":host": {
        display: "block",
        border_width: $.border_width.body,
        border_style: $.border_style.body,
        border_color: $.border_colour.body,
        border_radius: $.border_radius.body,
        box_shadow: $.border_shadow.body,
        overflow: "hidden",
        margin_bottom: $.margin.body.y.bottom,
      },
      ".title ::slotted(img)": {
        object_fit: "cover",
        width: `calc(100% + ${$.padding.body.y.right} + ${$.padding.body.y.left})`,
        margin_top: `-${$.padding.body.y.top}`,
        margin_bottom: `calc(-${$.padding.body.y.bottom} - 0.25em)`,
        margin_left: `-${$.padding.body.x.left}`,
        margin_right: `-${$.padding.body.x.right}`,
      },
      ".title, .body": {
        padding_top: $.padding.body.y.top,
        padding_bottom: $.padding.body.y.bottom,
        padding_left: $.padding.body.x.left,
        padding_right: $.padding.body.x.right,
      },
      ".title": {
        background: $.background_colour[title_colour],
        color: $.foreground_colour[title_colour],
        border_bottom_width: $.border_width.body,
        border_bottom_style: $.border_style.body,
        border_bottom_color: $.border_colour.body,
        font_family: $.font_family.p,
        font_size: $.font_size.p,
        font_weight: $.font_weight.p,
        text_decoration: $.text_decoration.p,
      },
      ".body": {
        background: $.background_colour[body_colour],
        color: $.foreground_colour[body_colour],
      },
    }),
    [use_prop("title-colour", IsString, "contrast"), use_prop("body-colour", IsString, "feature")] as const
  );

  return (
    <>
      <SlotToggle tag="div" class="title">
        <Slot name="title" />
      </SlotToggle>
      <div class="body">
        <slot />
      </div>
    </>
  );
};
