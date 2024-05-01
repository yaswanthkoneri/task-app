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
                <span className="font-bold">Task Name</span>
                <input
                    aria-label="name"
                    name="name"
                    type="text"
                    placeholder="Task Name"
                />
            </p>
            <label>
                <span className="font-bold">Description</span>
                <textarea
                    name="description" rows={6} placeholder="Description" />
            </label>
            <p className="flex items-center">
                <span className="font-bold">Completed</span>
                <input
                    className="ml-10 w-5 h-5"
                    aria-label="completed"
                    name="completed"
                    type="checkbox"
                />
            </p>
            <p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Save</button>
                <button onClick={() => navigate(-1)} type="button">
                    Cancel
                </button>
            </p>
        </Form>
    );
}
