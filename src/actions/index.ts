import { defineAction, ActionError } from "astro:actions"
import { z } from "astro/zod"
import { createClient } from "../lib/supabase"

export const server = {
  signUp: defineAction({
    accept: "form",
    input: z
      .object({
        name: z.string().min(1, "Name is required"),
        agency: z.string().min(1, "Agency name is required"),
        url: z.string().url("Please enter a valid URL").startsWith("https://", "URL must start with https://"),
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        "confirm-password": z.string(),
      })
      .refine((data) => data.password === data["confirm-password"], {
        message: "Passwords do not match",
        path: ["confirm-password"],
      }),
    handler: async ({ email, password, name, agency, url }, context) => {
      const supabase = createClient({
        request: context.request,
        cookies: context.cookies,
      })
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${new URL(context.request.url).origin}/auth/callback`,
          data: { name: name, agency: agency, url: url },
        },
      })
      if (error) {
        throw new ActionError({ code: "BAD_REQUEST", message: error.message })
      }
      return { message: "Check your email to confirm your account" }
    },
  }),

  signIn: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
      password: z.string(),
    }),
    handler: async (input, context) => {
      const supabase = createClient({
        request: context.request,
        cookies: context.cookies,
      })
      const { error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      })
      if (error) {
        throw new ActionError({ code: "UNAUTHORIZED", message: error.message })
      }
      return { success: true }
    },
  }),

  requestPasswordReset: defineAction({
    accept: "form",
    input: z.object({
      email: z.email("Invalid email address"),
    }),
    handler: async (input, context) => {
      const supabase = createClient({
        request: context.request,
        cookies: context.cookies,
      })
      const origin = new URL(context.request.url).origin
      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${origin}/auth/reset-password`,
      })
      if (error) {
        throw new ActionError({ code: "BAD_REQUEST", message: error.message })
      }
      return { message: "Check your email for a password reset link" }
    },
  }),

  updatePassword: defineAction({
    accept: "form",
    input: z
      .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        "confirm-password": z.string(),
      })
      .refine((data) => data.password === data["confirm-password"], {
        message: "Passwords do not match",
        path: ["confirm-password"],
      }),
    handler: async (input, context) => {
      const supabase = createClient({
        request: context.request,
        cookies: context.cookies,
      })
      const { error } = await supabase.auth.updateUser({
        password: input.password,
      })
      if (error) {
        throw new ActionError({ code: "BAD_REQUEST", message: error.message })
      }
      return { success: true }
    },
  }),

  signOut: defineAction({
    handler: async (_, context) => {
      const supabase = createClient({
        request: context.request,
        cookies: context.cookies,
      })
      await supabase.auth.signOut()
      return { success: true }
    },
  }),

  submitMrr: defineAction({
    accept: "json",
    input: z.object({
      targetUserId: z.uuid().optional(),
      value: z.number().int().min(0),
    }),
    handler: async ({ targetUserId, value }, context) => {
      const supabase = createClient({
        request: context.request,
        cookies: context.cookies,
      })
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new ActionError({ code: "UNAUTHORIZED", message: "Not authenticated" })
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("account_type")
        .eq("id", user.id)
        .single()

      if (!profile) {
        throw new ActionError({ code: "UNAUTHORIZED", message: "Profile not found" })
      }

      let userId: string
      if (profile.account_type === "admin") {
        if (!targetUserId) {
          throw new ActionError({ code: "BAD_REQUEST", message: "Admin must specify a target user" })
        }
        userId = targetUserId
      } else if (profile.account_type === "agency owner") {
        userId = user.id
      } else {
        throw new ActionError({ code: "FORBIDDEN", message: "Not authorized to submit MRR" })
      }

      const { error } = await supabase.from("mrr").upsert({ user_id: userId, value }, { onConflict: "user_id" })
      if (error) {
        throw new ActionError({ code: "BAD_REQUEST", message: error.message })
      }

      const { error: historyError } = await supabase
        .from("mrr_history")
        .insert({ user_id: userId, value })
      if (historyError) {
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR", message: historyError.message })
      }

      return { success: true }
    },
  }),
}
