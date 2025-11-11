import { WebComponent } from "WebComponent";
import { Set } from "@toolkit/set";
import { IsOneOf, Optional } from "@toolkit/safe-type";
import { CssModel } from "css/CssModel";

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "l-col": HTMLAttributes & {
        xs: `${number}`;
        sm?: `${number}`;
        md?: `${number}`;
        lg?: `${number}`;
        xl?: `${number}`;
      };
    }
  }
}

const Column = IsOneOf("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12");

export const Component: WebComponent = ({ use_css, use_prop }) => {
  use_css(
    ($, xs, sm, md, lg, xl) =>
      Set.FromObject({ sm, md, lg, xl })
        .where(([, value]) => typeof value === "string")
        .aggregate<CssModel>(
          {
            ":host": {
              dislay: "block",
              container: "section / inline-size",
              grid_column: `auto / span ${xs}`,
            },
          },
          ([key, value], current) => ({
            ...current,
            [$.breakpoint_query[key]]: {
              ":host": {
                grid_column: `auto / span ${value}`,
              },
            },
          })
        ),
    [
      use_prop("xs", Column),
      use_prop("sm", Optional(Column)),
      use_prop("md", Optional(Column)),
      use_prop("lg", Optional(Column)),
      use_prop("xl", Optional(Column)),
    ] as const
  );

  return <slot />;
};
