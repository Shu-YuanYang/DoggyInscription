import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, useLoaderData } from "@remix-run/react";

import { getNoteListItems } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

/*
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
};
*/

export default function InscriptionListPage({ noteList }: any[]) {
  //const data = useLoaderData<typeof loader>();
  //const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <hr />
          {!noteList || noteList.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {noteList.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={`inscription/${note.id}`} 
		    target="_blank"
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

      </main>
    </div>
  );
}
