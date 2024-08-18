import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, useLoaderData } from "@remix-run/react";



export default function InscriptionListPage({ inscriptionList }: any[]) {

  return (
    <div className="flex h-full max-h-full w-full flex-col" style={{
        display: "flex",
        flexDirection: "column"
      }}>
      
      <span className="text-lg font-bold mb-1">Recent Inscriptions:</span>
      <main className="flex h-4/5 w-full overflow-y-scroll">
        <div className="w-full border-r">
          {!inscriptionList || inscriptionList.length === 0 ? (
            <span className="text-base">No inscriptions yet</span>
          ) : (
            <ol>
              {inscriptionList.map((inscription) => (
                <li key={inscription.hash} className="border-b">
                  <NavLink
                    className={({ isActive }) =>
                      `text-sm text-blue-400 truncate ${isActive ? "" : ""}`
                    }
                    to={inscription.hash} 
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
