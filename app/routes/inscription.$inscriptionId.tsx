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
    <div>
      <h3 className="text-2xl font-bold">Inscription at: {data.inscription.timestamp}</h3>
      <span className="py-6">Wallet Address: {data.inscription.walletAddr}</span>
      <br />
      <span className="py-6">Inscription Type: {data.inscription.type}</span>
      <br />
      <span className="py-6">Inscribed Data:</span>
      <p className="">{data.inscription.data.toString()}</p>
      <span>Transaction Fee: {data.inscription.gasFee}</span>
      <br />
      <span className="py-6">Transaction Hash: {data.inscription.hash}</span>
      <hr className="my-4" />
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
