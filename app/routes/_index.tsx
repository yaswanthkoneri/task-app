import type { LinksFunction, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
} from "@remix-run/react";

import appStylesHref from "../app.css";
import { login, setSession } from "~/data";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

// Validation function for username
function validateUsername(username: string) {
  if (!username) {
    return "Username is required";
  }
}

// Validation function for password
function validatePassword(password: string) {
  if (!password) {
    return "Password is required";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const fieldErrors = {
    password: validatePassword(password),
    username: validateUsername(username),
  };
  const fields = { password, username };
  if (Object.values(fieldErrors).some(Boolean)) {
    return {
      fieldErrors,
      fields,
      formError: null,
    };
  }
  const updates = Object.fromEntries(formData);
  let result = await login(updates);
  const jwtToken = result.access
  let serializedSession = await setSession(request, jwtToken);

  return redirect('/tasks', {
    headers: {
      'Set-Cookie': serializedSession,
    }
  });
};


export default function Index() {
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  return (
    <body className="bg-gray-100 flex items-center justify-center h-screen">
      <div className="max-w-sm w-full rounded overflow-hidden shadow-lg bg-white">
        <div className="px-6 py-4">
          <h2 className="text-center font-bold mb-4">Login</h2>
          <Form id="login-form" method="post">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                defaultValue={actionData?.fields?.username}
                aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                aria-errormessage={
                  actionData?.fieldErrors?.username ? "username-error" : undefined
                }
              />
              {actionData?.fieldErrors?.username ? (
                <p
                  className="form-validation-error text-red-500"
                  role="alert"
                  id="username-error"
                >
                  {actionData.fieldErrors.username}
                </p>
              ) : null}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                defaultValue={actionData?.fields?.password}
                aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                aria-errormessage={
                  actionData?.fieldErrors?.password ? "password-error" : undefined
                }
              />
              {actionData?.fieldErrors?.password ? (
                <p
                  className="form-validation-error text-red-500"
                  role="alert"
                  id="password-error"
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null}
            </div>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
            </div>
          </Form>
        </div>
      </div>
    </body>
  );
}
