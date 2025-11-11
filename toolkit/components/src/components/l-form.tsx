import { IsLiteral, IsOneOf, IsString, Optional, PatternMatch } from "@toolkit/safe-type";
import { FormDataGatherEvent } from "shared/form/FormDataGatherEvent";
import { FormFindEvent, FormFindEventKey } from "shared/form/FormFindEvent";
import { FormSubmissionCompleteEvent } from "shared/form/FormSubmissionCompleteEvent";
import { FormSubmissionRejectedEvent } from "shared/form/FormSubmissionRejectedEvent";
import { FormSubmitEvent, FormSubmitEventKey } from "shared/form/FormSubmitEvent";
import { FormSubmittedEvent } from "shared/form/FormSubmittedEvent";
import { WebComponent } from "WebComponent";

export const Component: WebComponent = ({ self, use_css, use_event, use_prop }) => {
  const url = use_prop("url", Optional(IsString));
  const method = use_prop("method", IsString, "POST");
  const data_type = use_prop("data-type", IsOneOf("json", "form"), "json");
  const headers = use_prop("headers", Optional(IsString));
  const success_url = use_prop("success-url", Optional(IsString));

  use_css(() => ({ ":host": { display: "block" } }), []);

  use_event(
    FormFindEventKey,
    (e) => {
      if (!(e instanceof FormFindEvent)) return;
      e.RegisterSelf(self);
      e.stopImmediatePropagation();
      e.preventDefault();
    },
    []
  );

  use_event(
    FormSubmitEventKey,
    async (e) => {
      if (!(e instanceof FormSubmitEvent)) return;

      const data = new FormDataGatherEvent();
      self.dispatchEvent(data);

      if (data.HasErrors) return;

      const event = new FormSubmittedEvent(data.Values);
      self.dispatchEvent(event);

      if (!url || event.defaultPrevented) return;
      const result = await fetch(url, {
        method,
        body:
          data_type === "json"
            ? JSON.stringify(data.Values)
            : (() => {
                const result = new FormData();
                for (const key in data.Values)
                  result.set(key, data.Values[key] instanceof Blob ? data.Values[key] : data.Values[key].toString());
                return result;
              })(),
        headers: [
          ...PatternMatch(IsLiteral("json"), IsLiteral("form"))(
            () => [["Content-Type", "application/json"]] as Array<[string, string]>,
            () => [] as Array<[string, string]>
          )(data_type),
          ...(headers
            ?.split(";")
            .filter((v) => v.includes("="))
            .map((v) => v.split("=") as [string, string]) ?? []),
        ],
      });

      if (!result.ok) {
        self.dispatchEvent(new FormSubmissionRejectedEvent(data.Values, result));
        return;
      }

      const complete_event = new FormSubmissionCompleteEvent(data.Values, result);
      self.dispatchEvent(complete_event);
      if (complete_event.defaultPrevented || !success_url) return;
      window.location.href = success_url;
    },
    [url, method, data_type, headers, success_url]
  );

  return <slot />;
};
