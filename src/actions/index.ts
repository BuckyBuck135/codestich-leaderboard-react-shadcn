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
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        "confirm-password": z.string(),
      })
      .refine((data) => data.password === data["confirm-password"], {
        message: "Passwords do not match",
        path: ["confirm-password"],
      }),
    handler: async ({ email, password, name, agency }, context) => {
      console.log("signUp handler", { email, name, agency })
      const supabase = createClient({
        request: context.request,
        cookies: context.cookies,
      })
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${new URL(context.request.url).origin}/auth/callback`,
          data: { name: name, agency: agency },
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
}
