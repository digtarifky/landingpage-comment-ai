## Setup

Copy `.env.example` to `.env.local`. Create an OAuth Client ID of type **Web application** in Google Cloud Console and authorize `http://localhost:3000` as a JavaScript origin. Set that ID as `NEXT_PUBLIC_GOOGLE_CLIENT_ID` here and `GOOGLE_WEB_CLIENT_ID` in Backend. If the consent screen is in Testing, add your Google account as a test user. Set `NEXT_PUBLIC_EXTENSION_ID` to the ID shown at `chrome://extensions`; add the Landingpage origin to the extension's `externally_connectable.matches` in its manifest. `NEXT_PUBLIC_API_BASE_URL` defaults to `http://localhost:5000`.

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated visitors are redirected to Google sign-in before entering `/dashboard`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
