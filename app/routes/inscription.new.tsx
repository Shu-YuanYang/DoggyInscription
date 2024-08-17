import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createFakeInscription, getFakeWallet } from "~/models/inscription.server";
import { requireUserId } from "~/session.server";

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
  
  

  //const note = await createNote({ body, title, userId });
  const verifiedWallet = await getFakeWallet({ address: walletAddr });
  if (verifiedWallet.address !== walletAddr) {
    return json(
      { errors: { text: null, walletAddr: "Invalid wallet address!" } },
      { status: 400 },
    );
  }
  const test_result = await createFakeInscription({ type: "text/plain;charset=utf8", data: text, walletAddr: walletAddr, gasFee: "0.264 DOGE" });

  return redirect(`/`);
  //return test_result;
};

export default function NewInscriptionPage() {
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
      action="/inscription/new"
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
          Save
        </button>
      </div>
    </Form>
  );
}
