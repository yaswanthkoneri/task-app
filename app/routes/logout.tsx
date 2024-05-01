import type { ActionArgs, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { setSession } from "../data";
import { sessionIdSessionStorage } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
    // Clear the JWT token from the session storage
    const sessionIdSession = await sessionIdSessionStorage.getSession(request.headers.get('Cookie'));
    sessionIdSession.unset('jwtToken'); // or sessionIdSession.unset('jwtToken');

    // Clear the session cookie
    const serializedSession = await sessionIdSessionStorage.commitSession(sessionIdSession, {
        expires: new Date(0), // Set expiry to a past date to invalidate the cookie
        secure: process.env.NODE_ENV === 'production',
    });

    // Redirect to the login page or any other desired destination
    return redirect('/', {
        headers: {
            'Set-Cookie': serializedSession,
        },
    });
};
