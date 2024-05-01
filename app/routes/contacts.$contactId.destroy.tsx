import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact, getJWTToken } from "../data";

export const action = async ({ request, params }: ActionArgs) => {
  try {
    console.log("inside action", params.contactId)
    invariant(params.contactId, "Missing contactId param");
    const token = await getJWTToken(request)
    let contact = await deleteContact(params.contactId, token);
    console.log(contact)
    return redirect("/contacts");
  } catch (err) {
    console.error(err)
    return null;
  }

};
