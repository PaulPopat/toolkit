export const ContextChangedKey = crypto.randomUUID();

export class ContextChangedEvent extends Event {
  constructor() {
    super(ContextChangedKey, {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
  }
}
