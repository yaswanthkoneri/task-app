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

    <body>
      <div className="card-container">
        <div className="card">
          <Form id="task-form" method="post">
            <p>
              <span>Username</span>
              <input
                aria-label="username"
                name="username"
                type="text"
                placeholder="Username"
              />
            </p>
            <p>
              <span>Password</span>
              <input
                aria-label="password"
                name="password"
                type="password"
                placeholder="password"
              />
            </p>
            <p>
              <button type="submit">Login</button>
              <button onClick={() => navigate(-1)} type="button">
                Cancel
              </button>
            </p>
          </Form>
        </div>
      </div>
    </body>
  );
}
