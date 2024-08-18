import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { getFakeInscription } from "~/models/inscription.server";
import { requireUserId } from "~/session.server";

import DogeHeader from "./doge_header";



export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  //const userId = await requireUserId(request);
  invariant(params.inscriptionId, "inscriptionId not found");

  const inscription = await getFakeInscription({ hash: params.inscriptionId });
  if (!inscription) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ inscription });
};



export default function InscriptionDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col bg-zinc-100">
	<main className="relative w-full bg-zinc-100 sm:items-center sm:justify-center" style={{ height: "88%" }}>
	    <DogeHeader pageTitle="Inscription Details" />

	    <div className="h-full mx-auto max-w-8xl pt-3 sm:px-6">
		<h3 className="text-2xl font-bold">Inscription at: {data.inscription.timestamp}</h3>
		<span className="py-6 text-lg">Wallet Address: {data.inscription.walletAddr}</span>
		<br />
		<span className="py-6 text-lg">Inscription Type: {data.inscription.type}</span>
		<br />
		<span className="py-6 text-lg">Transaction Fee: {data.inscription.gasFee}</span>
		<br />
		<span className="py-6 text-lg">Transaction Hash: {data.inscription.hash}</span>
		<br />
		{/*
		<span className="py-6 text-lg">Inscribed Data:</span>
                <p className="text-lg">{data.inscription.data.toString()}</p>
		*/}
		<label className="flex w-full flex-col">
			<span className="text-lg">Inscribed Data: </span>
			<textarea
				disabled={true}
				name="text"
				rows={10}
				className="w-full flex-1 rounded-md border-2 px-3 py-2 text-lg leading-6"
				placeholder="Enter text to inscribe"
				aria-invalid={undefined}
				aria-errormessage={undefined}
				value={data.inscription.data.toString()}
			/>
		</label> 
		<hr className="my-4" />
	    </div>
	</main>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
