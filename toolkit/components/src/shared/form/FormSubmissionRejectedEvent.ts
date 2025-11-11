import { FormDataModel } from "./FormData";

export class FormSubmissionRejectedEvent extends Event {
  readonly #data: FormDataModel;
  readonly #response: Response;

  constructor(data: FormDataModel, response: Response) {
    super("error", {
      bubbles: true,
      composed: true,
      cancelable: false,
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
