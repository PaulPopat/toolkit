export const FormSubmitEventKey = crypto.randomUUID();

export class FormSubmitEvent extends Event {
  constructor() {
    super(FormSubmitEventKey, {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
  }
}
