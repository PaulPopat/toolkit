import { FormDataModel } from "./FormData";

export class FormSubmittedEvent extends Event {
  readonly #data: FormDataModel;

  constructor(data: FormDataModel) {
    super("submitted", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    this.#data = data;
  }

  get Data() {
    return this.#data;
  }
}
