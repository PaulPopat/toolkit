import { WebComponent } from "WebComponent";
import { Set } from "@toolkit/set";
import { IsLiteral, IsString, Optional } from "@toolkit/safe-type";
import { CssModel } from "css/CssModel";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-container": HTMLAttributes & {
        colour?: string;
        flush?: boolean;
        display?: string;
      };
    }
  }
}

export const Component: WebComponent = ({ use_css, use_aria, use_prop }) => {
  use_css(
    ($, colour, flush, display) =>
      typeof flush === "string"
        ? {
            ":host": {
              display: "block",
              container: "section / inline-size",
              ...(colour
                ? {
                    background: $.background_colour[colour],
                    color: $.foreground_colour[colour],
                  }
                : {}),
            },
            ".content": {
              display,
              padding_left: $.padding.body.x.left,
              padding_right: $.padding.body.x.right,
              width: "100%",
            },
          }
        : new Set(["xs", "sm", "md", "lg", "xl"]).aggregate<CssModel>(
            {
              ":host": {
                display: "block",
                container: "section / inline-size",
                ...(colour
                  ? {
                      background: $.background_colour[colour],
                      color: $.foreground_colour[colour],
                    }
                  : {}),
              },
              ".content": {
                display,
                margin: "0 auto",
                width: "100%",
              },
            },
            (next, current) => ({
              ...current,
              [$.breakpoint_query[next]]: {
                ".content": {
                  max_width: $.breakpoint_max_width[next],
                },
              },
            })
          ),
    [
      use_prop("colour", Optional(IsString)),
      use_prop("flush", Optional(IsLiteral(""))),
      use_prop("display", IsString, "block"),
    ] as const
  );

  use_aria("role", "section");

  return (
    <div class="content">
      <slot />
    </div>
  );
};
