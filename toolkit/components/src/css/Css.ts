import { Block } from "./Block";
import { CssBlockModel } from "./CssModel";

export class Css {
  readonly #blocks: Array<Block>;

  constructor(blocks: Record<string, CssBlockModel>) {
    this.#blocks = Object.keys(blocks).map((b) => new Block(b, blocks[b]));
  }

  toString() {
    return this.#blocks.map((b) => b.toString()).join("\n");
  }
}
