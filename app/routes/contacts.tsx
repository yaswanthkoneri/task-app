import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
    Form,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useSubmit,
} from "@remix-run/react";
import { useEffect } from "react";

import appStylesHref from "../app.css";
import { getTasks, getJWTToken } from "../data";
import { sessionIdSessionStorage } from "~/session.server";

export const action = async () => {
    // const contact = await createEmptyContact();
    return redirect(`/contacts/new`);
};

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: appStylesHref },
];

export const loader = async ({ request }: LoaderArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const token = await getJWTToken(request)
    const contacts = await getTasks(q, token);
    if (contacts === 401) {
        return redirect('/')
    }
    return json({ contacts, q });
};

export default function Contacts() {
    const { contacts, q } = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const submit = useSubmit();
    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

    useEffect(() => {
        const searchField = document.getElementById("q");
        if (searchField instanceof HTMLInputElement) {
            searchField.value = q || "";
        }
    }, [q]);

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <div id="sidebar">
                    <h1>Remix Tasks
                        <span>
                            <form method="post" action="/logout">
                                <button>Logout</button>
                            </form>
                        </span>
                    </h1>
                    <div>
                        <Form
                            id="search-form"
                            onChange={(event) => {
                                const isFirstSearch = q === null;
                                submit(event.currentTarget, { replace: !isFirstSearch });
                            }}
                            role="search"
                        >
                            <input
                                aria-label="Search contacts"
                                className={searching ? "loading" : ""}
                                defaultValue={q || ""}
                                id="q"
                                name="q"
                                placeholder="Search"
                                type="search"
                            />
                            <div aria-hidden hidden={!searching} id="search-spinner" />
                        </Form>
                        <Form method="post">
                            <button type="submit">New</button>
                        </Form>
                    </div>
                    <nav>
                        {contacts?.length ? (
                            <ul>
                                {contacts.map((contact) => (
                                    <li key={contact.id}>
                                        <NavLink
                                            className={({ isActive, isPending }) =>
                                                isActive ? "active" : isPending ? "pending" : ""
                                            }
                                            to={`/contacts/${contact.id}`} // Adjusted the URL here
                                        >
                                            {contact.name ? (
                                                <>
                                                    {contact.name}
                                                    {contact.completed && "✅"}
                                                </>
                                            ) : (
                                                <i>No Name</i>
                                            )}{" "}
                                            {/* {contact.favorite ? <span>★</span> : null} */}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>
                                <i>No contacts</i>
                            </p>
                        )}
                    </nav>
                </div>
                <div
                    className={
                        navigation.state === "loading" && !searching ? "loading" : ""
                    }
                    id="detail"
                >
                    <Outlet />
                </div>
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
