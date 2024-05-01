import type { LinksFunction, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useNavigate,
} from "@remix-run/react";

import appStylesHref from "../app.css";
import { login, setSession } from "~/data";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
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
              />
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
              />
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
