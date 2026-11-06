# Admin login & live publishing (Supabase — free plan)

The admin panel uses **Supabase Auth**: the email and password are checked on
Supabase's servers, and the database itself refuses edits from anyone who isn't
on the admin list. The password is never stored in this project.

Admin account: **studiorgu1@rgs.edu.in**

## One-time setup (about 10 minutes)

1. **Create a project** at <https://supabase.com/dashboard> (free plan is enough).
2. **Run the database setup:** *SQL Editor → New query*, paste all of
   [`schema.sql`](./schema.sql), click **Run**.
3. **Create the admin user:** *Authentication → Users → Add user → Create new user*
   - Email: `studiorgu1@rgs.edu.in`
   - Password: the admin password
   - Tick **Auto Confirm User**
4. **Stop strangers signing up:** *Authentication → Sign In / Providers →* turn off
   **Allow new users to sign up**. (Even if someone did sign up, they couldn't
   edit anything — but this keeps the user list clean.)
5. **Allow the reset-password link to come back to the site:**
   *Authentication → URL Configuration*
   - **Site URL:** your live address, e.g. `https://media.rgu.example`
   - **Redirect URLs:** add the live address **and** `http://localhost:3000`
6. **Connect the website:** *Project Settings → API*, copy the **Project URL** and
   the **anon / publishable** key into `.env.local` in the project folder:

   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

   Add the same two variables to your hosting provider's build settings
   (Vercel / Netlify / etc.), then restart `npm run dev` or redeploy.

## Using it

- Click **Admin** in the top bar (or press Ctrl+Shift+A) and sign in.
- **Save draft** previews your edits in your browser only.
- **Publish** makes them live for every visitor immediately — no redeploy.
- **Publish → Version history** keeps the last 50 published versions; load one
  and Publish to roll back.
- Member/gallery photos have an **Upload** button (images are resized and stored
  in the `site-media` bucket).

## Forgot password

On the sign-in screen click **Forgot password?**, enter the admin email, and open
the emailed link. The site opens on *Choose a new password*.

Supabase's built-in email sender is limited to a few emails per hour on the
free plan. For more, add your own SMTP under *Authentication → Emails → SMTP*.

## Adding another admin

Add the user under *Authentication → Users*, then in the SQL Editor run:

```sql
insert into public.site_admins (email) values ('someone@rgs.edu.in');
```
