import { ComponentBase } from "ComponentBase";
import { WebComponent } from "WebComponent";

export function CreateComponent(
  name: string,
  factory: () => Promise<{ Component: WebComponent }>,
  ...observed_attributes: Array<string>
) {
  customElements.define(
    name,
    class extends ComponentBase {
      static readonly observedAttributes = observed_attributes;

      readonly Definition = factory().then((r) => r.Component);
    }
  );
}
