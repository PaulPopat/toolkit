import { IsThemePropertyKey } from "theme/Fetcher";
import { CssPropertyModel, CssBlockModel } from "./CssModel";
import { Property } from "./Property";

export class Block {
  readonly #preamble: string;
  readonly #entries: Array<Block | Property>;

  constructor(preamble: string, entries: Record<string, CssPropertyModel | CssBlockModel>) {
    this.#preamble = preamble;
    this.#entries = Object.keys(entries).map((k) =>
      typeof entries[k] === "object" && !(IsThemePropertyKey in entries[k])
        ? new Block(k, entries[k])
        : new Property(k, entries[k].toString())
    );
  }

  toString(): string {
    return [this.#preamble.toString() + " {", ...this.#entries.map((e) => e.toString()), "}"].join("\n");
  }
}
