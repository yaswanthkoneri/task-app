import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { TaskRecord } from "../data";
import { getTask, getJWTToken, updateTask } from "../data";

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.taskId, "Missing taskId param");
  const token = await getJWTToken(request)
  const task = await getTask(params.taskId, token);
  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ task });
};

export default function task() {
  const { task } = useLoaderData<typeof loader>();

  return (
    <div id="task">
      <div>
        <h1>
          {task.name ? (
            <>
              {task.name}
              {task.completed && "✅"}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>
        {task.description ? <p>{task.description}</p> : null}
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
