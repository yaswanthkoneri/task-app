import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getTask, getJWTToken, updateTask } from "../data";
import { useState } from "react";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.taskId, "Missing taskId param");
  const formData = await request.formData();
  const completed = formData.get("completed") === "on";
  const updates = { ...Object.fromEntries(formData), completed: completed };
  const token = await getJWTToken(request)
  await updateTask(params.taskId, updates, token);
  return redirect(`/tasks/${params.taskId}`);
};

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.taskId, "Missing taskId param");
  const token = await getJWTToken(request)
  const task = await getTask(params.taskId, token);
  if (!task) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ task });
};

export default function Edittask() {
  const { task } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(task.completed);

  const handleCheckboxChange = (event: any) => {
    setCompleted(event.target.checked);
  };

  return (
    <Form id="task-form" method="post">
      <p>
        <span className="font-bold">Task Name</span>
        <input
          defaultValue={task.name}
          aria-label="name"
          name="name"
          type="text"
          placeholder="Task Name"
        />
      </p>
      <label>
        <span className="font-bold">Description</span>
        <textarea defaultValue={task.description} placeholder="Description" name="description" rows={6} />
      </label>
      <label className="font-bold flex items-center">
        <span>Completed</span>
        <input
          className="w-5 h-5 grow-0"
          style={{ flexGrow: 0 }}
          checked={completed}
          name="completed"
          type="checkbox"
          onChange={handleCheckboxChange}
        />
      </label>
      <p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
