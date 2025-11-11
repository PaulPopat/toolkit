import { FormDataModel } from "./FormData";

export const FormDataGatherEventKey = crypto.randomUUID();

export type ErrorType = "REQUIRED" | "INVALID";

export class FormDataGatherEvent extends Event {
  readonly #values: FormDataModel = {};
  readonly #errors: Record<string, Array<string>> = {};

  constructor() {
    super(FormDataGatherEventKey, {
      bubbles: false,
      composed: false,
      cancelable: false,
    });
  }

  AddValue(key: string, value: string | Blob) {
    this.#values[key] = value;
  }

  AddError(key: string, error: ErrorType) {
    this.#errors[key] = [...(this.#errors[key] ?? []), error];
  }

  get HasErrors() {
    return !!Object.keys(this.#errors).length;
  }

  get Values() {
    return this.#values;
  }

  get Errors() {
    return this.#errors;
  }
}
