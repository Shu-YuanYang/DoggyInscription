//import { createCookieSessionStorage, redirect } from "@remix-run/node";
//import invariant from "tiny-invariant";

//import type { User } from "~/models/user.server";
//import { getUserById } from "~/models/user.server";

//invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

/*
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";
*/



export async function getTest(request: Request) {
  let obj = { pid: "random", mass: 25 };
  console.log(obj);
  return obj;
}


