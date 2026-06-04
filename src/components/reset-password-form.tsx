import { actions, isInputError } from "astro:actions"
import { withState } from "@astrojs/react/actions"
import { useActionState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, action, pending] = useActionState(
    withState(actions.updatePassword),
    { data: undefined, error: undefined },
  )

  const fieldErrors = isInputError(state.error) ? state.error.fields : {}
  const generalError =
    state.error && !isInputError(state.error) ? state.error.message : null

  useEffect(() => {
    if (state.data?.success) {
      window.location.href = "/auth/signin"
    }
  }, [state.data])

  return (
    <form
      action={action}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Set new password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Choose a strong password for your account
          </p>
        </div>
        {generalError && (
          <p className="text-center text-sm text-destructive">{generalError}</p>
        )}
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <PasswordInput id="password" name="password" required />
          <FieldDescription>Must be at least 6 characters long.</FieldDescription>
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
          {fieldErrors["confirm-password"] && (
            <p className="text-sm text-destructive">
              {fieldErrors["confirm-password"]}
            </p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Updating…" : "Update password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
