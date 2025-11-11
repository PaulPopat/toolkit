export const FormFindEventKey = crypto.randomUUID();

export class FormFindEvent extends Event {
  #form: Element | undefined;

  constructor() {
    super(FormFindEventKey, {
      bubbles: true,
      composed: true,
      cancelable: false,
    });
  }

  RegisterSelf(self: Element) {
    this.#form = self;
  }

  get Form() {
    return this.#form;
  }
}
