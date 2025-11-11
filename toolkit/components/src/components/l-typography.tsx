import { Set } from "@toolkit/set";
import { CssModel } from "css/CssModel";
import { useState } from "preact/hooks";
import { UseSlotChange } from "utils/slot";
import { WebComponent } from "WebComponent";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-typography": HTMLAttributes & {};
    }
  }
}

export const Component: WebComponent = ({ use_css }) => {
  const [html, set_html] = useState("");
  use_css(
    ($) =>
      new Set(["p", "a", "span", "small", "b", "i", "h1", "h2", "h3", "h4", "h5", "h6"]).aggregate<CssModel>(
        {
          ":host": {
            display: "block",
          },
        },
        (tag, css) =>
          ({
            ...css,
            [tag]: {
              font_family: $.font_family[tag],
              font_size: $.font_size[tag],
              font_weight: $.font_weight[tag],
              text_decoration: $.text_decoration[tag],
              margin_top: $.margin[tag].y.top,
              margin_bottom: $.margin[tag].y.bottom,
            },
            [`${tag}:first-of-type`]: {
              margin_top: "0",
            },
            [`${tag}:last-of-type`]: {
              margin_bottom: "0",
            },
          } as CssModel)
      ),
    [] as const
  );

  const ref = UseSlotChange((slot) =>
    set_html(
      new Set(slot.assignedNodes()).aggregate("", (i, c) => c + (i instanceof Element ? i.outerHTML : i.textContent))
    )
  );

  return (
    <>
      <div style={{ display: "none" }}>
        <slot ref={ref} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
};
