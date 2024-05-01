import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, createContact, getJWTToken } from "../data";

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const token = await getJWTToken(request)
    let result = await createContact(updates, token);
    return redirect(`/contacts/${result.id}`);
};

export const loader = async ({ params }: LoaderArgs) => {
    // invariant(params.contactId, "Missing contactId param");
    // const contact = await getContact(params.contactId);
    // if (!contact) {
    //     throw new Response("Not Found", { status: 404 });
    // }
    return json({});
};

export default function EditContact() {
    const { contact } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <Form id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input
                    defaultValue={contact?.name}
                    aria-label="name"
                    name="name"
                    type="text"
                    placeholder="First"
                />
            </p>
            <label>
                <span>Description</span>
                <textarea defaultValue={contact?.description} name="description" rows={6} />
            </label>
            <p>
                <button type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">
                    Cancel
                </button>
            </p>
        </Form>
    );
}
