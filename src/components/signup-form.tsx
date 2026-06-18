import { actions, isInputError } from "astro:actions"
import { withState } from "@astrojs/react/actions"
import { useActionState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, action, pending] = useActionState(withState(actions.signUp), {
    data: undefined,
    error: undefined,
  })

  const fieldErrors = isInputError(state.error) ? state.error.fields : {}
  const generalError =
    state.error && !isInputError(state.error) ? state.error.message : null

  return (
    <form
      action={action}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        {generalError && (
          <p className="text-center text-sm text-destructive">{generalError}</p>
        )}
        {state.data?.message && (
          <p className="text-center text-sm text-green-600">
            {state.data.message}
          </p>
        )}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
          />
          {fieldErrors.name && (
            <p className="text-sm text-destructive">{fieldErrors.name}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="agency">Your agency</FieldLabel>
          <Input
            id="agency"
            name="agency"
            type="text"
            placeholder="Doe Web Studio"
            required
          />
          {fieldErrors.agency && (
            <p className="text-sm text-destructive">{fieldErrors.agency}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="url">Your agency URL</FieldLabel>
          <Input
            id="url"
            name="url"
            type="text"
            placeholder="https://www.doewebstudio.com"
            required
          />
          {fieldErrors.url && (
            <p className="text-sm text-destructive">{fieldErrors.url}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          {fieldErrors.email && (
            <p className="text-sm text-destructive">{fieldErrors.email}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput id="password" name="password" required />
          <FieldDescription>
            Must be at least 6 characters long.
          </FieldDescription>
          {fieldErrors.password && (
            <p className="text-sm text-destructive">{fieldErrors.password}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <PasswordInput
            id="confirm-password"
            name="confirm-password"
            required
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
          {fieldErrors["confirm-password"] && (
            <p className="text-sm text-destructive">
              {fieldErrors["confirm-password"]}
            </p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating account…" : "Create Account"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
