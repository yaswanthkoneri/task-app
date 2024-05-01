import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteTask, getJWTToken } from "../data";

export const action = async ({ request, params }: ActionArgs) => {
  try {
    console.log("inside action", params.taskId)
    invariant(params.taskId, "Missing taskId param");
    const token = await getJWTToken(request)
    let task = await deleteTask(params.taskId, token);
    return redirect("/tasks");
  } catch (err) {
    console.error(err)
    return null;
  }
};
