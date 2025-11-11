import { FormDataModel } from "./FormData";

export class FormSubmissionCompleteEvent extends Event {
  readonly #data: FormDataModel;
  readonly #response: Response;

  constructor(data: FormDataModel, response: Response) {
    super("completed", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    this.#data = data;
    this.#response = response;
  }

  get Data() {
    return this.#data;
  }

  get Response() {
    return this.#response;
  }
}
