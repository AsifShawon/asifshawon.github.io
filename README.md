This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Environment variables

Copy `.env.local.example` to `.env.local` and fill it in. The same variables
need to exist in the Vercel project settings (all environments).

### Contact form

`/contact` posts to `src/app/api/contact/route.ts`, which sends the message
over Gmail SMTP with Nodemailer. It needs:

| Variable | Required | Notes |
| --- | --- | --- |
| `CONTACT_EMAIL_USER` | yes | Gmail address that sends the notification |
| `CONTACT_EMAIL_APP_PASSWORD` | yes | Google **App Password**, not the account password |
| `CONTACT_EMAIL_TO` | no | Delivery address; defaults to `asifbhuiyanshawon@gmail.com` |

Generating the app password requires 2-Step Verification on the Google
account: <https://myaccount.google.com/apppasswords>.

Spam protection reuses the same Cloudflare Turnstile keys as the blog comment
form (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`). When those
are unset the API skips the challenge, so local development works without
them; the honeypot, server-side validation and rate limit still apply.

All three contact variables are server-only — none carry the `NEXT_PUBLIC_`
prefix, so they never reach browser JavaScript.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
