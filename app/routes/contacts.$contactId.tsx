import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { ContactRecord } from "../data";
import { getContact, getJWTToken, updateContact } from "../data";

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const token = await getJWTToken(request)
  const contact = await getContact(params.contactId, token);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <div id="contact">
      <div>
        <h1>
          {contact.name ? (
            <>
              {contact.name}
              {contact.completed && "✅"}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          {/* <Favorite contact={contact} /> */}
        </h1>

        {/* {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null} */}

        {contact.description ? <p>{contact.description}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record.",
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}
