import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, getJWTToken, updateContact } from "../data";
import { useState } from "react";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  const completed = formData.get("completed") === "on";
  const updates = { ...Object.fromEntries(formData), completed: completed };
  console.log(updates, params.contactId)
  const token = await getJWTToken(request)
  await updateContact(params.contactId, updates, token);
  return redirect(`/contacts/${params.contactId}`);
};

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const token = await getJWTToken(request)
  const contact = await getContact(params.contactId, token);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(contact.completed);

  const handleCheckboxChange = (event: any) => {
    setCompleted(event.target.checked);
  };

  return (
    <Form id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={contact.name}
          aria-label="name"
          name="name"
          type="text"
          placeholder="First"
        />
      </p>
      <label>
        <span>Description</span>
        <textarea defaultValue={contact.description} name="description" rows={6} />
      </label>
      <label>
        <input
          style={{ flexGrow: 0 }}
          checked={completed}
          name="completed"
          type="checkbox"
          onChange={handleCheckboxChange}
        />
        Completed
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
