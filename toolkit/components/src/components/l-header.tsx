import { IsString, Optional } from "@toolkit/safe-type";
import { CssModel } from "css/CssModel";
import { useState } from "preact/hooks";
import { c } from "utils/c";
import { UseSlotChange } from "utils/slot";
import { WebComponent } from "WebComponent";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-header": HTMLAttributes & {
        logo?: string;
        "logo-alt"?: string;
        colour?: string;
      };
    }
  }
}

export const Component: WebComponent = ({ self, use_css, use_aria, use_prop }) => {
  use_aria("role", "menu");
  const logo = use_prop("logo", Optional(IsString));
  const logo_alt = use_prop("logo-alt", Optional(IsString));
  const colour = use_prop("colour", IsString, "highlight");
  const [mega_open, set_mega_open] = useState(false);
  const [mega_selected, set_mega_selected] = useState("");

  use_css(
    ($, colour): CssModel => ({
      ":host": {
        display: "block",
        position: "sticky",
        top: "0",
        z_index: $.z_index.header,
        background: $.background_colour[colour],
        color: $.foreground_colour[colour],
        border_bottom_width: $.border_width.body,
        border_bottom_style: $.border_style.body,
        border_bottom_color: $.border_colour.body,
        box_shadow: $.border_shadow.body,
        padding_top: $.padding.body.y.top,
        padding_bottom: $.padding.body.y.bottom,
      },
      ".logo-col": {
        display: "flex",
        align_items: "center",
        justify_content: "space-between",
      },
      ".logo-container": {
        padding_left: $.padding.body.x.left,
        padding_right: $.padding.body.x.right,
      },
      ".main-links": {
        display: "none",
        align_items: "center",
        justify_content: "flex-start",
        flex: "1",
        gap: $.gap,
        overflow: "hidden",
        padding_left: $.padding.body.x.left,
        padding_right: $.padding.body.x.right,
      },
      ".right-actions": {
        display: "none",
        align_items: "center",
        justify_content: "flex-end",
        gap: $.gap,
        overflow: "hidden",
        padding_left: $.padding.body.x.left,
        padding_right: $.padding.body.x.right,
      },
      "::slotted(a),::slotted(span)": {
        display: "inline-block",
        font_family: $.font_family.a,
        font_size: $.font_size.a,
        font_weight: $.font_weight.a,
        text_decoration: $.text_decoration.a,
        color: $.foreground_colour[colour],
      },
      ".megamenu": {
        margin: "0 auto",
        container: "section / inline-size",
        display: "none",
        background: $.background_colour.body,
        color: $.foreground_colour.body,
        border_bottom_width: $.border_width.body,
        border_bottom_style: $.border_style.body,
        border_bottom_color: $.border_colour.body,
        box_shadow: $.border_shadow.body,
        box_sizing: "border-box",
        position: "absolute",
        top: "100%",
        left: "0",
        width: "100%",
        height: "0",
        overflow: "hidden",
        transition: ["height", $.animation_speed.fast].join(" "),
      },
      ".megamenu.open, .megamenu-data": {
        height: $.megamenu.height,
      },
      ".expland-button": { display: "block" },
      [$.breakpoint_query.md]: {
        ".expand-button": { display: "none" },
        ".megamenu": { display: "block" },
        ".main-links, .right-actions": { display: "flex" },
      },
    }),
    [colour] as const
  );

  const main = UseSlotChange((m) => {
    const click_away = (e: Event) => {
      if (e.composedPath().find((t) => t === self)) return;
      set_mega_open(false);
    };

    document.addEventListener("click", click_away);

    const handler = (e: Event) => {
      const target = e.target;
      if (!(target instanceof HTMLAnchorElement)) return;
      const toggle = target.dataset.toggle;
      if (!toggle) return;
      e.preventDefault();
      e.stopPropagation();
      set_mega_selected(toggle);
      set_mega_open((o) => !o);
    };

    const added: Array<HTMLAnchorElement> = [];
    for (const entry of m.assignedElements()) {
      if (!(entry instanceof HTMLAnchorElement)) continue;
      added.push(entry);
      entry.addEventListener("click", handler);
    }

    return () => {
      for (const entry of added) {
        if (!(entry instanceof HTMLAnchorElement)) continue;
        entry.removeEventListener("click", handler);
      }

      document.removeEventListener("click", click_away);
    };
  });

  return (
    <l-container display="flex">
      <div class="logo-col">
        {logo ? (
          <div class="logo-container">
            <img src={logo} alt={logo_alt ?? ""} />
          </div>
        ) : (
          <div />
        )}

        <a href="#mobile-nav" class="expand-button" tabindex={0}>
          <l-icon name="menu-3" tag="p" colour={colour} text />
        </a>
      </div>

      <div class="main-links">
        <div class="main-content scrollable">
          <slot ref={main} class="desktop-slot" />
        </div>
      </div>

      <div class="right-actions">
        <slot name="right" />
      </div>
      <div class={c("megamenu", ["open", mega_open])}>
        <div class="megamenu-data">
          <slot name={mega_selected} class="desktop-slot" />
        </div>
      </div>

      <l-offcanvas trigger="#mobile-nav">
        <span slot="title">
          <slot name="mobile-title" />
        </span>
        <slot name="mobile-nav" />
      </l-offcanvas>
    </l-container>
  );
};
