## Vite bugs

504 hydration issues
rm -rf node_modules/.vite

### MUST-HAVE

[x] shadcn UI
[x] RLS
[x] hook up dashboard to supabase
[x] chart
[x] table
[x] user info / avatar
[x] realtime subscription supabase
[x] addMRR form in dashboard
[x] sign in as guest or all users can read
[x] Forget password on signin form
[x] logo on dashboard

### NICE-TO-HAVE

[x] validate https:// for url
[x] more user info in Header
[] OAuth with Github
[x] show password toggle on forms
[x] remove linting and prettier
[] customize supabase notification emails
[] had to turn of 'confirm email' feature from supabase as there's a rate limit on free tier. Changed the error message and navigate behavior upon signup.

## supabase functions

### getUser()

```js
const supabase = createClient({
	request: Astro.request,
	cookies: Astro.cookies,
});

const { data } = await supabase.auth.getUser();
if (!data?.user) return Astro.redirect("/auth/signin");

const user = data.user;
```

## Supabase Tables

### Table `user_profiles`

#### Columns

| Name           | Type          | Constraints |
| -------------- | ------------- | ----------- |
| `id`           | `uuid`        | Primary     |
| `created_at`   | `timestamptz` |             |
| `name`         | `text`        | Nullable    |
| `account_type` | `text`        | Nullable    |
| `agency`       | `text`        | Nullable    |
| `url`          | `text`        | Nullable    |

### Table `mrr`

mrr in USD/mo of community members

#### Columns

| Name         | Type          | Constraints      |
| ------------ | ------------- | ---------------- |
| `id`         | `int8`        | Primary Identity |
| `created_at` | `timestamptz` |                  |
| `value`      | `int4`        | Nullable         |
| `user_id`    | `uuid`        | Nullable         |

### Table auth.user

Supabase default table

#### Columns

| Name           | Type          | Constraints |
| -------------- | ------------- | ----------- |
| `uid`          | `uuid`        | Primary     |
| `display name` | `text`        | Nullable    |
| `email`        | `email`       |             |
| `created_at`   | `timestamptz` |             |

## Supabase trigger

### Create user_profile trigger handler

Everytime a new user is created (through dashboard or signup form), this trigger copies data into public.user_profiles

```sql
 CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
 AS $$
 BEGIN
   INSERT INTO public.user_profiles (id, created_at, name, account_type, agency, url)
   VALUES (
     NEW.id,
     NOW(),
     NEW.raw_user_meta_data ->> 'name',
     'agency owner',
     NEW.raw_user_meta_data ->> 'agency',
     NEW.raw_user_meta_data ->> 'url'
   );
   RETURN NEW;
 END;
 $$;
```

## RLS

-- user_profiles: public read
CREATE POLICY "public_read_profiles" ON public.user_profiles
FOR SELECT USING (true);

-- mrr: public read (leaderboard is open)
CREATE POLICY "public_read_mrr" ON public.mrr
FOR SELECT USING (true);

-- mrr: agency owner inserts their own row
CREATE POLICY "agency owner can only add their own mrr" ON public.mrr
FOR INSERT WITH CHECK (
user_id = auth.uid()
AND EXISTS (
SELECT 1 FROM public.user_profiles
WHERE id = auth.uid() AND account_type = 'agency owner'
)
);

-- mrr: admin inserts for anyone
CREATE POLICY "admin can add any mrr" ON public.mrr
FOR INSERT WITH CHECK (
EXISTS (
SELECT 1 FROM public.user_profiles
WHERE id = auth.uid() AND account_type = 'admin'
)
);

-- mrr: agency owner updates their own row
CREATE POLICY "agency_owner_update_own_mrr" ON public.mrr
FOR UPDATE USING (
user_id = auth.uid()
AND EXISTS (
SELECT 1 FROM public.user_profiles
WHERE id = auth.uid() AND account_type = 'agency owner'
)
);

-- mrr: admin updates any row
CREATE POLICY "admin_update_any_mrr" ON public.mrr
FOR UPDATE USING (
EXISTS (
SELECT 1 FROM public.user_profiles
WHERE id = auth.uid() AND account_type = 'admin'
)
);

Note: To promote a user to admin, manually set their account_type = 'admin' in the Supabase table editor. All new signups default to 'agency owner'  
via the existing trigger.

## OAuth and onboarding

Plan: OAuth (GitHub / Google) with Custom Field Onboarding

Context

The app collects custom fields (name, agency, url) during email/password signup and stores them via a Supabase trigger into user_profiles. OAuth  
 flows don't have a signup form, so those fields need a separate collection step after the OAuth redirect completes.

The Custom Fields Problem

OAuth users land in auth.users → trigger fires → user_profiles row created with agency and url as null (they don't come from the OAuth provider). The
solution is a post-OAuth onboarding page that collects these fields before letting the user into the dashboard.

---

Implementation Steps

1.  External Setup (manual, no code)

GitHub:

1.  Go to GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2.  Set Authorization callback URL to: https://<your-supabase-project>.supabase.co/auth/v1/callback
3.  Copy Client ID and Client Secret
4.  In Supabase dashboard → Authentication → Providers → GitHub → paste them

Google:

1.  Go to Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID
2.  Add https://<your-supabase-project>.supabase.co/auth/v1/callback to Authorized redirect URIs
3.  Copy Client ID and Client Secret
4.  In Supabase dashboard → Authentication → Providers → Google → paste them

---

2.  OAuth server endpoint

Create src/pages/auth/oauth.ts — a GET endpoint that reads ?provider=github or ?provider=google, generates the OAuth URL via Supabase, and redirects  
 the browser to it.

// src/pages/auth/oauth.ts
import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
const url = new URL(request.url);
const provider = url.searchParams.get("provider") as "github" | "google";

const supabase = createClient(cookies);
const { data, error } = await supabase.auth.signInWithOAuth({
provider,
options: {
redirectTo: `${url.origin}/auth/callback`,
},
});

if (error || !data.url) return redirect("/auth/signin");
return redirect(data.url);
};

---

3.  Wire OAuth buttons

In src/components/signin-form.tsx and src/components/signup-form.tsx, update the existing GitHub button to be an <a> tag pointing to the endpoint:

 <a href="/auth/oauth?provider=github">
   <Button variant="outline" type="button">
     {/* existing SVG */}
     Sign in with GitHub
   </Button>
 </a>

Add a second button for Google if desired (same pattern with ?provider=google).

---

4.  Post-OAuth onboarding flow

Update src/pages/auth/callback.astro: After successful session exchange, check if the user's user_profiles row is missing agency. If so, redirect to  
 /auth/onboard instead of /dashboard.

// After session is confirmed:
const { data: profile } = await supabase
.from("user_profiles")
.select("agency")
.eq("id", session.user.id)
.single();

if (!profile?.agency) {
return Astro.redirect("/auth/onboard");
}
return Astro.redirect("/dashboard");

Create src/pages/auth/onboard.astro: Protected page (redirect to signin if no session). Renders an OnboardForm component.

Create src/components/onboard-form.tsx: Form with agency and url fields (and optionally name pre-filled from OAuth metadata). Submits to a new  
 updateProfile action.

Add updateProfile action in src/actions/index.ts:
updateProfile: defineAction({
input: z.object({ agency: z.string().min(1), url: z.string().url().optional() }),
handler: async ({ agency, url }, context) => {
const supabase = createClient(context.cookies);
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new ActionError({ code: "UNAUTHORIZED" });

     await supabase
       .from("user_profiles")
       .update({ agency, url })
       .eq("id", user.id);

     return { success: true };

}
})

On success, redirect to /dashboard.

---

5.  Update the Supabase trigger (SQL Editor)

The trigger uses raw_user_meta_data ->> 'name' but OAuth providers use full_name. Update to handle both:

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
INSERT INTO public.user_profiles (id, created_at, name, account_type, agency, url)
VALUES (
NEW.id,
NOW(),
COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name'),
'agency owner',
NEW.raw_user_meta_data ->> 'agency',
NEW.raw_user_meta_data ->> 'url'
);
RETURN NEW;
END;

$$
;

 Run this in the Supabase SQL Editor.

 ---
Files to Create / Modify

 ┌─────────────────────────────────┬───────────────────────────────────────────────────┐
│              File               │                      Action                       │
├─────────────────────────────────┼───────────────────────────────────────────────────┤
│ src/pages/auth/oauth.ts         │ Create                                            │
├─────────────────────────────────┼───────────────────────────────────────────────────┤
│ src/pages/auth/callback.astro   │ Update (add profile check + conditional redirect) │
├─────────────────────────────────┼───────────────────────────────────────────────────┤
│ src/pages/auth/onboard.astro    │ Create                                            │
├─────────────────────────────────┼───────────────────────────────────────────────────┤
│ src/components/onboard-form.tsx │ Create                                            │
├─────────────────────────────────┼───────────────────────────────────────────────────┤
│ src/components/signin-form.tsx  │ Update (wire OAuth button)                        │
├─────────────────────────────────┼───────────────────────────────────────────────────┤
│ src/components/signup-form.tsx  │ Update (wire OAuth button)                        │
├─────────────────────────────────┼───────────────────────────────────────────────────┤
│ src/actions/index.ts            │ Update (add updateProfile action)                 │
└─────────────────────────────────┴───────────────────────────────────────────── ──────┘
$$
