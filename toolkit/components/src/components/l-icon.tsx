import { IsOneOf, IsString, Optional } from "@toolkit/safe-type";
import { useMemo } from "preact/hooks";
import { WebComponent } from "WebComponent";
import RemixIcon from "remixicon/fonts/remixicon.css";
import RemixIconFont from "remixicon/fonts/remixicon.ttf";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-icon": HTMLAttributes & {
        name: string;
        fill?: boolean;
        plain?: boolean;
        tag?: string;
        colour?: string;
        text?: boolean;
        spin?: boolean;
        children?: never;
      };
    }
  }
}

const sheet_url = new URL(RemixIcon, import.meta.url);
const font_url = new URL(RemixIconFont, import.meta.url);

const remixicon_sheet = fetch(sheet_url)
  .then((r) => r.text())
  .then((t) => {
    const sheet = new CSSStyleSheet({});
    sheet.replaceSync(t);
    for (let i = 0; i < sheet.cssRules.length; i++) {
      const rule = sheet.cssRules.item(i);
      if (rule instanceof CSSFontFaceRule) sheet.deleteRule(i);
    }

    document.adoptedStyleSheets.push(sheet);

    return sheet;
  });

fetch(font_url)
  .then((r) => r.arrayBuffer())
  .then(
    (r) =>
      new FontFace("remixicon", r, {
        display: "swap",
      })
  )
  .then((r) => r.load())
  .then((r) => {
    document.fonts.add(r);
  });

export const Component: WebComponent = ({ root, use_css, use_prop }) => {
  const name = use_prop("name", IsString);
  const fill = use_prop("fill", Optional(IsOneOf("", "true")));
  const plain = use_prop("plain", Optional(IsOneOf("", "true")));

  useMemo(() => remixicon_sheet.then((s) => root.adoptedStyleSheets.push(s)), []);

  use_css(
    ($, tag, spin, text, colour) => ({
      "@keyframes spin": {
        from: {
          transform: "rotate(0deg)",
        },
        to: {
          transform: "rotate(360deg)",
        },
      },
      ":host": {
        display: "inline-flex",
        align_items: "center",
        justify_content: "center",
        width: $.font_size[tag],
        height: $.font_size[tag],
      },
      span: {
        background_color: "transparent !important",
        vertical_align: "middle",
        line_height: 1,
        width: $.font_size[tag],
        height: $.font_size[tag],
        font_size: $.font_size[tag],
        color: typeof text === "string" ? $.foreground_colour[colour] : $.background_colour[colour],
      },
      ...(typeof spin === "string"
        ? {
            "@media (prefers-reduced-motion: no-preference)": {
              "span:before": {
                display: "inline-block",
                animation_name: "spin",
                animation_timing_function: "linear",
                animation_duration: $.animation_speed.slow,
                animation_iteration_count: "infinite",
              },
            },
          }
        : {}),
    }),
    [
      use_prop("tag", IsString, "p"),
      use_prop("spin", Optional(IsOneOf("", "true"))),
      use_prop("text", Optional(IsOneOf("", "true"))),
      use_prop("colour", IsString, "body"),
    ] as const
  );

  return <span class={`ri-${name}${typeof plain === "string" ? "" : typeof fill === "string" ? "-fill" : "-line"}`} />;
};
