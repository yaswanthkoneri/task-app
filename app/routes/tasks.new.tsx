import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";

import { createTask, getJWTToken } from "../data";

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const token = await getJWTToken(request)
    let result = await createTask(updates, token);
    return redirect(`/tasks/${result.id}`);
};

export default function CreateTask() {
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
