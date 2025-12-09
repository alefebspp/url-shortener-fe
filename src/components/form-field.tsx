import { useFieldContext } from "@/hooks/form-context";
import { useStore } from "@tanstack/react-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = React.ComponentProps<"input"> & {
  label: string;
};

export default function FormField({ label, ...props }: Props) {
  const field = useFieldContext<string | number>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div>
      <Label className="grid gap-2" htmlFor={field.name}>
        <div className="text-muted-foreground">{label}</div>
        <Input
          {...props}
          id={field.name}
          value={field.state.value}
          onChange={(e) =>
            field.handleChange(
              props.type === "number" ? e.target.valueAsNumber : e.target.value
            )
          }
        />
      </Label>
      {isInvalid && (
        <span className="text-sm text-error pt-0.5">
          {errors.map((err) => err.message).join(",")}
        </span>
      )}
    </div>
  );
}
