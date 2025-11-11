import { Assert, IsInstanceOf, IsLiteral, IsString, Optional } from "@toolkit/safe-type";
import { useEffect, useState } from "preact/hooks";
import { ComponentContext } from "WebComponent";
import { ErrorType, FormDataGatherEvent, FormDataGatherEventKey } from "./FormDataGatherEvent";
import { ComponentBase } from "ComponentBase";
import { FormFindEvent } from "./FormFindEvent";

type UseFormProps = {
  self: ComponentBase;
  use_prop: ComponentContext["use_prop"];
  use_event: ComponentContext["use_event"];
};

function FindForm(self: ComponentBase) {
  const find = new FormFindEvent();
  self.dispatchEvent(find);

  return find.Form;
}

export function UseFormValue({ self, use_prop, use_event }: UseFormProps) {
  const default_value = use_prop("prefill", Optional(IsString));
  const [value, set_value] = useState(default_value);
  const [error, set_error] = useState<ErrorType | undefined>();
  const name = use_prop("name", IsString);
  const required = use_prop("required", Optional(IsLiteral("")));
  const validate = use_prop("validate", Optional(IsString));
  const [form, set_form] = useState<Element | undefined>();

  useEffect(() => {
    const found = FindForm(self);
    if (found) set_form(found);
    else {
      const interval = setInterval(() => {
        const found = FindForm(self);
        if (found) {
          set_form(found);
          clearInterval(interval);
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    set_value(default_value);
  }, [default_value]);

  use_event(
    FormDataGatherEventKey,
    (e) => {
      Assert(IsInstanceOf(FormDataGatherEvent), e);
      set_error(undefined);
      if (typeof required === "string" && !value?.trim()) {
        e.AddError(name, "REQUIRED");
        set_error("REQUIRED");
      } else if (typeof validate === "string" && !value?.match(validate)) {
        e.AddError(name, "INVALID");
        set_error("INVALID");
      }

      if (value) e.AddValue(name, value);
    },
    [value, required, validate, name, set_error, form],
    form
  );

  return Object.freeze([value, set_value, error] as const);
}

type UseBlobFormProps = {
  self: ComponentBase;
  use_prop: ComponentContext["use_prop"];
  use_event: ComponentContext["use_event"];
};

export function UseBlobFormValue({ self, use_prop, use_event }: UseBlobFormProps) {
  const [value, set_value] = useState<Blob | null>(null);
  const [error, set_error] = useState<ErrorType | undefined>();
  const name = use_prop("name", IsString);
  const required = use_prop("required", Optional(IsLiteral("")));
  const [form, set_form] = useState<Element | undefined>();

  useEffect(() => {
    const found = FindForm(self);
    if (found) set_form(found);
    else {
      const interval = setInterval(() => {
        const found = FindForm(self);
        if (found) {
          set_form(found);
          clearInterval(interval);
        }
      }, 500);
    }
  }, []);

  use_event(
    FormDataGatherEventKey,
    (e) => {
      Assert(IsInstanceOf(FormDataGatherEvent), e);
      set_error(undefined);
      if (typeof required === "string" && !value) {
        e.AddError(name, "REQUIRED");
        set_error("REQUIRED");
      }

      if (value) e.AddValue(name, value);
    },
    [value, required, name, set_error, form],
    form
  );

  return Object.freeze([value, set_value, error] as const);
}
