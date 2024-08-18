import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Form, useLoaderData, useActionData } from "@remix-run/react";

import type { FakeWallet } from "@prisma/client";
import { getAllFakeInscriptionList, getFakeWallet, createFakeInscription } from "~/models/inscription.server";
import { useEffect, useRef, useState } from "react";

import InscriptionListPage from "./inscription.list";
import DogeHeader from "./doge_header";



export const loader = async ({ request }: LoaderFunctionArgs) => {
  const inscriptionList = await getAllFakeInscriptionList();
  return json({ inscriptionList });
};

export const action = async ({ request }: ActionFunctionArgs) => {

  const formData = await request.formData();
  const walletAddr = formData.get("walletAddr");
  const text = formData.get("text");

  if (typeof walletAddr !== "string" || walletAddr.length === 0) {
    return json(
      { errors: { text: null, walletAddr: "Please enter your wallet address!" } },
      { status: 400 },
    );
  }

  if (typeof text !== "string" || text.length === 0) {
    return json(
      { errors: { text: "Please enter some text to inscribe!", walletAddr: null } },
      { status: 400 },
    );
  }

  let verifiedWallet: FakeWallet = null;
  try {
    verifiedWallet = await getFakeWallet({ address: walletAddr });
  } catch (err) {}

  if (!verifiedWallet || verifiedWallet.address !== walletAddr) {
    return json(
      { errors: { text: null, walletAddr: "Invalid wallet address!" } },
      { status: 400 },
    );
  }

  try {
      const test_result = await createFakeInscription({ type: "text/plain;charset=utf8", data: text, walletAddr: walletAddr, gasFee: "300 DOGE" });
  } catch (err) {
      console.log(err.message);
      return json(
        { errors: { text: "Invalid transaction data!", walletAddr: null } },
        { status: 400 },
      );
  }


  return json(
	{ success: { message: "text successfully inscribed!" } },
	{ status: 200 }
	); //redirect("/inscription");
};

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];





function NewInscriptionForm() {
  const actionData = useActionData<typeof action>();
  const walletAddrRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [textVal, setTextVal] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.walletAddr) {
      walletAddrRef.current?.focus();
    } else if (actionData?.errors?.text) {
      textRef.current?.focus();
    }

    if (actionData?.success?.message) {
	setTextVal("");
    }

    setIsRunning(false);
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
      onSubmit={() => setIsRunning(true)}
    >
      <div>
        <label className="flex w-full flex-col">
          <span className="text-lg font-bold">Wallet Address (A 300 DOGE gas fee will be charged per inscription):</span>
          <input
            ref={walletAddrRef}
            name="walletAddr"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
	    placeholder="Enter wallet address"
            aria-invalid={actionData?.errors?.walletAddr ? true : undefined}
            aria-errormessage={
              actionData?.errors?.walletAddr ? "wallet-addr-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.walletAddr ? (
          <div className="pt-1 text-red-700" id="wallet-addr-error">
            {actionData.errors.walletAddr}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col">
          <span className="text-lg font-bold">Text: </span>
          <textarea
            ref={textRef}
	    value={textVal}
	    onChange={(e) => setTextVal(e.target.value)}
            name="text"
            rows={5}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
	    placeholder="Enter text to inscribe"
            aria-invalid={actionData?.errors?.text ? true : undefined}
            aria-errormessage={
              actionData?.errors?.text ? "text-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.text ? (
          <div className="pt-1 text-red-700" id="text-error">
            {actionData.errors.text}
          </div>
        ) : null}
      </div>

	<div className="flex justify-between">
		{isRunning? 
		<button type="submit" 
			className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:bg-gray-400" 
			disabled={true}
		>Inscribing...</button> :
		<button
			type="submit"
			className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
		>Inscribe</button>
		}
		{actionData?.success?.message?
                        (<span className="text-green-700">{actionData.success.message}</span>) : null
                }
	</div>
    </Form>
  );
}







export default function Inscription() {
  //const user = useOptionalUser();
  const data = useLoaderData<typeof loader>();
  //const user = useUser();
  

  return (

  <div className="flex h-full min-h-screen flex-col bg-zinc-100">
    <DogeHeader pageTitle="Inscription" />

    <main className="relative w-full bg-zinc-100 sm:items-center sm:justify-center" style={{ height: "88%" }}>
      <div className="relative h-full sm:pb-8">
        
	<div className="h-full mx-auto max-w-8xl sm:px-6">
          <div className="relative h-full shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-white mix-blend-multiply" />
            </div>
            <div className="relative h-full px-4 sm:px-6 sm:pb-14 lg:px-8 lg:pb-4">
              <div className="h-1/2 mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <NewInscriptionForm /> 
              </div>

	      <hr className="my-4" />

	      <div className="h-2/5 mx-auto max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <InscriptionListPage inscriptionList={data.inscriptionList} />
              </div>


            </div>
          </div>
        </div>

      </div>
    </main>

  </div>
  );
}
