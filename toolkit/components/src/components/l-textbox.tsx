import { IsLiteral, Optional } from "@toolkit/safe-type";
import { UseInputStyling } from "shared/form/UseInputStyling";
import { UseDelegatedFocus } from "shared/form/UseDelegatedFocus";
import { UseFormValue } from "shared/form/UseFormValue";
import { WebComponent } from "WebComponent";

export const Component: WebComponent = ({ self, use_css, use_event, use_prop }) => {
  const sensitive = use_prop("sensitive", Optional(IsLiteral("")));
  const [value, set_value, error] = UseFormValue({ self, use_prop, use_event });
  const { ref, focused } = UseDelegatedFocus<HTMLInputElement>({ self, use_event });
  UseInputStyling({ use_css, use_prop, value, error, focused });

  return (
    <>
      <div class="title-text">
        <slot />
      </div>
      <input
        class="input"
        name="input"
        value={value ?? ""}
        onChange={(e) => set_value(e.currentTarget.value)}
        type={typeof sensitive === "string" ? "password" : "text"}
        ref={ref}
      />
      {error && (
        <div class="error">
          <slot name={error.toLowerCase()} />
        </div>
      )}
    </>
  );
};
