import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";

import { createTask, getJWTToken } from "../data";

function validateTaskName(name: string) {
    if (!name) {
        return "Task Name is required";
    }
}
function validateTask(name: string, description: string) {
    if (name === description) {
        return "Task Name and Description both cannot be same";
    }
}

export const action = async ({ request }: ActionArgs) => {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const completed = formData.get("completed") as string;
    const fieldErrors = {
        name: validateTaskName(name),
        description: validateTask(name, description),
    };
    const fields = { name, description, completed };
    if (Object.values(fieldErrors).some(Boolean)) {
        return {
            fieldErrors,
            fields,
            formError: null,
        };
    }
    const updates = Object.fromEntries(formData);
    const token = await getJWTToken(request)
    let result = await createTask(updates, token);
    if (result.id) {
        return redirect(`/tasks/${result.id}`);
    } else {
        console.log(JSON.stringify(result))
        return null
    }
};

export default function CreateTask() {
    const navigate = useNavigate();
    const actionData = useActionData<typeof action>();

    return (
        <Form id="task-form" method="post">
            <p>
                <span className="font-bold">Task Name</span>
                <input
                    aria-label="name"
                    name="name"
                    type="text"
                    placeholder="Task Name"
                    aria-invalid={Boolean(actionData?.fieldErrors?.name)}
                    aria-errormessage={
                        actionData?.fieldErrors?.name ? "name-error" : undefined
                    }
                />
                {actionData?.fieldErrors?.name ? (
                    <p
                        className="form-validation-error text-red-500"
                        role="alert"
                        id="name-error"
                    >
                        {actionData.fieldErrors.name}
                    </p>
                ) : null}
            </p>
            <label>
                <span className="font-bold">Description</span>
                <textarea
                    name="description"
                    rows={6}
                    placeholder="Description"
                    aria-invalid={Boolean(actionData?.fieldErrors?.description)}
                    aria-errormessage={
                        actionData?.fieldErrors?.description ? "description-error" : undefined
                    }
                />
                {actionData?.fieldErrors?.description ? (
                    <p
                        className="form-validation-error text-red-500"
                        role="alert"
                        id="description-error"
                    >
                        {actionData.fieldErrors.description}
                    </p>
                ) : null}
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
