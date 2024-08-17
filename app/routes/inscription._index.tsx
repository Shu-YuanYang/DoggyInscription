import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Form, useLoaderData, useActionData } from "@remix-run/react";

import type { FakeWallet } from "@prisma/client";
import { getAllFakeInscriptionList, getFakeWallet, createFakeInscription } from "~/models/inscription.server";
import { useEffect, useRef } from "react";

//import NewInscriptionPage from "./inscription.new";
import InscriptionListPage from "./inscription.list";




export const loader = async ({ request }: LoaderFunctionArgs) => {
  //const userId = await requireUserId(request);
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


  return json({ status: 200 }); //redirect("/inscription");
};

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];





function NewInscriptionForm() {
  const actionData = useActionData<typeof action>();
  const walletAddrRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.walletAddr) {
      walletAddrRef.current?.focus();
    } else if (actionData?.errors?.text) {
      textRef.current?.focus();
    }
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
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Wallet Address: </span>
          <input
            ref={walletAddrRef}
            name="walletAddr"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
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
        <label className="flex w-full flex-col gap-1">
          <span>Text: </span>
          <textarea
            ref={textRef}
            name="text"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
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

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Inscribe
        </button>
      </div>
    </Form>
  );
}







export default function Inscription() {
  //const user = useOptionalUser();
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
                <NewInscriptionForm /> 
              </div>

	      <hr className="my-4" />

	      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                <InscriptionListPage inscriptionList={data.inscriptionList} />
              </div>


            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
