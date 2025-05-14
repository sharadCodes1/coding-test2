import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/lib/db.server";
import type { ActionFunction } from "@remix-run/node";

export const loader = async () => {
  const snippets = await prisma.snippet.findMany({ orderBy: { createdAt: "desc" } });
  return json({ snippets });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name") as string;
  const code = form.get("code") as string;
  await prisma.snippet.create({ data: { name, code } });
  return redirect("/snippets");
};

type Snippet = {
  id: number;
  name: string;
  code: string;
};

export default function Snippets() {
  const { snippets } = useLoaderData<typeof loader>();

  return (
    <div className="p-4 space-y-4">
      <Form method="post" className="space-y-4 p-4 border rounded shadow bg-white">
        <input
          name="name"
          placeholder="Name"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <textarea
          name="code"
          placeholder="JS Code"
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </Form>

      <div className="space-y-4">
        {snippets.map((s: Snippet) => (
          <div
            key={s.id}
            className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm space-y-2"
          >
            <p className="text-lg font-semibold text-gray-800">{s.name}</p>

            <pre className="bg-gray-100 text-sm text-gray-700 p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
              {s.code}
            </pre>

            <Form method="post" action="execute" className="inline">
              <input type="hidden" name="code" value={s.code} />
              <button
                type="submit"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                ▶ Run
              </button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}
