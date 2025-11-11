export const PropChangedEventKey = crypto.randomUUID();

export class PropChangedEvent extends Event {
  readonly #key: string;

  constructor(key: string) {
    super(PropChangedEventKey, {
      bubbles: false,
      cancelable: false,
      composed: false,
    });

    this.#key = key;
  }

  get Key() {
    return this.#key;
  }
}
