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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, action, pending] = useActionState(
    withState(actions.requestPasswordReset),
    { data: undefined, error: undefined },
  )

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
          <h1 className="text-2xl font-bold">Forgot your password?</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
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
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </Field>
        {generalError && (
          <p className="text-center text-sm text-destructive">{generalError}</p>
        )}
        {state.data?.message && (
          <p className="text-center text-sm text-green-600">
            {state.data.message}
          </p>
        )}
        <FieldDescription className="text-center">
          <a href="/auth/signin" className="underline underline-offset-4">
            Back to sign in
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
