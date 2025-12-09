import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import { Loader } from "lucide-react";

import {
  fieldContext,
  formContext,
  useFormContext,
} from "@/hooks/form-context";
import { Button, type ButtonProps } from "@/components/ui/button";

const FormField = lazy(() => import("@/components/form-field"));

export function SubmitButton({
  label,
  ...props
}: ButtonProps & { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state}>
      {({ isSubmitting, canSubmit }) => (
        <Button {...props} type="submit" disabled={isSubmitting || !canSubmit}>
          {isSubmitting ? <Loader className=" animate-spin" /> : label}
        </Button>
      )}
    </form.Subscribe>
  );
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    FormField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
