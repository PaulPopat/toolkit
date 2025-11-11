export const ContextEventKey = crypto.randomUUID();

export class RequestContextEvent extends Event {
  readonly #data: Record<string | symbol, unknown> = {};

  constructor() {
    super(ContextEventKey, {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }

  AddData(key: string | symbol, data: unknown) {
    if (this.#data[key]) return;

    this.#data[key] = data;
  }

  get Data() {
    return this.#data;
  }
}
