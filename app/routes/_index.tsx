import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { json } from "@remix-run/node";
import { useOptionalUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { getNoteListItems } from "~/models/note.server";

import NewInscriptionPage from "./inscription.new";
import InscriptionListPage from "./inscription.list";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
};


export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  const data = useLoaderData<typeof loader>();
  //const user = useUser();
  

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        
	<div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply" />
            </div>
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block text-yellow-500 drop-shadow-md">
                  DogeCoin - Inscription
                </span>
              </h1>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <NewInscriptionPage /> 
              </div>

	      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <InscriptionListPage noteList={data.noteListItems} />
              </div>


            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
