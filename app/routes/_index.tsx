import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getAllFakeInscriptionList } from "~/models/inscription.server";

import NewInscriptionPage from "./inscription.new";
import InscriptionListPage from "./inscription.list";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  return redirect("/inscription");
};


export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
    </main>
  );
}
