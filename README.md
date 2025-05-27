This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Enviroment Variables

To create on N88, first you need to set up some variables on a .env file. Let`s run into it!

```js
// GOOGLE_CLIENT_ID is responsable for the Google Cloud Client
GOOGLE_CLIENT_ID=35639228398-82hpkpodhdfolpcjjaaeqtlgbh3qdjf5.apps.googleusercontent.com

// GOOGLE_CLIENT_ID is responsable for the Google Cloud Client Secret
GOOGLE_CLIENT_SECRET=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

// NEXTAUTH_SECRET is responsable for the Next Auth Secret
NEXTAUTH_SECRET=4sxTApL6qjfA8evJZEUG5Vq53wy2pOX32sLGKjMLras=

// This is the public database URL, deployed on Vercel
NEXT_PUBLIC_DATABASE_URL="https://n88-backend.vercel.app/"

// This is probably your private backend URL, that should be running on localhost
# NEXT_PUBLIC_DATABASE_URL='http://localhost:8000/'

// This is the url from your local frontend, that should be hosted on localhost
NEXT_PUBLIC_FRONTEND_URL='http://localhost:3000/'

// This is your SESSION_SECRET_KEY, basically a random hash
SESSION_SECRET_KEY=4sxTApL6qjfA8evJZEUG5Vq53wy2pOX32sLGKjMLras=
```

