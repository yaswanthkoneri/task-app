import type { LinksFunction, LoaderArgs, ActionArgs, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
    Form,
    useLoaderData,
    useNavigate,
} from "@remix-run/react";

import appStylesHref from "../app.css";
import { login, setSession } from "~/data";
import { sessionIdSessionStorage } from '~/session.server';
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: appStylesHref },
];

// export const action = async ({ request }: ActionArgs) => {
//     const formData = await request.formData();
//     const updates = Object.fromEntries(formData);
//     let result = await login(updates);
//     console.log(result)
//     localStorage.setItem('token', result.access)
//     return redirect(`/contacts/`);
// };



export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    let result = await login(updates);
    const jwtToken = result.access
    let serializedSession = await setSession(request, jwtToken);

    return redirect('/contacts', {
        headers: {
            'Set-Cookie': serializedSession,
        }
    });
};


export const loader = async ({ params }: LoaderArgs) => {
    return json({});
};

export default function Login() {
    const { contact } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (

        <body>
            <div className="card-container">
                <div className="card">
                    <Form id="contact-form" method="post">
                        <p>
                            <span>Username</span>
                            <input
                                aria-label="username"
                                name="username"
                                type="text"
                                placeholder="Username"
                            />
                        </p>
                        <p>
                            <span>Password</span>
                            <input
                                aria-label="password"
                                name="password"
                                type="password"
                                placeholder="password"
                            />
                        </p>
                        <p>
                            <button type="submit">Login</button>
                            <button onClick={() => navigate(-1)} type="button">
                                Cancel
                            </button>
                        </p>
                    </Form>
                </div>
            </div>
        </body>
    );
}
