import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact } from "../data";

export const action = async ({ params }: ActionArgs) => {
  try {
    console.log("inside action", params.contactId)
    invariant(params.contactId, "Missing contactId param");
    let contact = await deleteContact(params.contactId);
    console.log(contact)
    return redirect("/contacts");
  } catch (err) {
    console.error(err)
    return null;
  }

};
