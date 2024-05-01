import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getTask, createTask, getJWTToken } from "../data";

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const token = await getJWTToken(request)
    let result = await createTask(updates, token);
    return redirect(`/tasks/${result.id}`);
};

export const loader = async ({ params }: LoaderArgs) => {
    // invariant(params.taskId, "Missing taskId param");
    // const task = await getTask(params.taskId);
    // if (!task) {
    //     throw new Response("Not Found", { status: 404 });
    // }
    return json({});
};

export default function Edittask() {
    const { task } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <Form id="task-form" method="post">
            <p>
                <span>Name</span>
                <input
                    aria-label="name"
                    name="name"
                    type="text"
                    placeholder="First"
                />
            </p>
            <label>
                <span>Description</span>
                <textarea
                    name="description" rows={6} />
            </label>
            <p>
                <input
                    aria-label="completed"
                    name="completed"
                    type="checkbox"
                />
                <span>Completed</span>
            </p>
            <p>
                <button type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">
                    Cancel
                </button>
            </p>
        </Form>
    );
}
