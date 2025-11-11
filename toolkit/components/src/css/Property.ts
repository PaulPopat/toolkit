export class Property {
  readonly #key: string;
  readonly #value: string;

  constructor(key: string, value: string) {
    this.#key = key;
    this.#value = value;
  }

  toString() {
    return [this.#key.toString().replace(/_/gm, "-"), ":", this.#value.toString(), ";"].join("");
  }
}
