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
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, action, pending] = useActionState(withState(actions.signIn), {
    data: undefined,
    error: undefined,
  })

  const fieldErrors = isInputError(state.error) ? state.error.fields : {}
  const generalError =
    state.error && !isInputError(state.error) ? state.error.message : null

  useEffect(() => {
    if (state.data?.success) {
      window.location.href = "/dashboard"
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
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/auth/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <PasswordInput id="password" name="password" required />
          {fieldErrors.password && (
            <p className="text-sm text-destructive">{fieldErrors.password}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Logging in…" : "Login"}
          </Button>
        </Field>
        {generalError && (
          <p className="text-center text-sm text-destructive">{generalError}</p>
        )}
        <FieldSeparator>Don&apos;t have an account? </FieldSeparator>

        <FieldDescription className="text-center">
          {/* Don&apos;t have an account?{" "} */}
          <a href="/auth/signup" className="underline underline-offset-4">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
