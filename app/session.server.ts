import { createCookieSessionStorage } from "@remix-run/node";

export const sessionIdSessionStorage = createCookieSessionStorage({
    cookie: {
      name: 'sessionid',
      path: '/',
      secrets: ['SESSION_SECRET'],
      secure: process.env.NODE_ENV === 'production',
      // More cookie options could be added here, but we will be using the cookie options from the fetch responses later.
    },
  })