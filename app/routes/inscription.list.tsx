import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, useLoaderData } from "@remix-run/react";



export default function InscriptionListPage({ inscriptionList }: any[]) {

  return (
    <div className="flex h-full w-full flex-col" style={{
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}>
      
      <main className="flex h-full w-full bg-white">
        <div className="h-full w-full border-r bg-gray-50">
          <hr />
          {!inscriptionList || inscriptionList.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {inscriptionList.map((inscription) => (
                <li key={inscription.hash}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl truncate ${isActive ? "bg-white" : ""}`
                    }
                    to={`inscription/${inscription.hash}`} 
		    target="_blank"
                  >
                    {`${inscription.timestamp}: ${inscription.hash}`}
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
