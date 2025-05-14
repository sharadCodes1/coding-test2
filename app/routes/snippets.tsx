import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { prisma } from "~/lib/db.server";
import type { ActionFunction } from "@remix-run/node";

export const loader = async () => {
    const snippets = await prisma.snippet.findMany({ orderBy: { createdAt: 'desc' } });
    return json({ snippets });
};

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const name = form.get('name') as string;
    const code = form.get('code') as string;
    await prisma.snippet.create({ data: { name, code } });
    return redirect('/snippets');
};
type Snippet = {
    id: string;
    name: string;
    code: string;
  };
  
export default function Snippets() {
    const { snippets } = useLoaderData<typeof loader>();

    return (
        <div className="p-4 space-y-4">
            <Form method="post" className="space-y-4">
                <input name="name" placeholder="Name" className="input" required />
                <textarea name="code" placeholder="JS Code" className="textarea" required />
                <button type="submit" className="button">Save</button>
            </Form>

            <div className="space-y-3">
                {snippets.map((s : Snippet) => (
                    <div key={s.id}>
                        <p className="font-bold">{s.name}</p>
                        <pre className="bg-gray-100 p-2 rounded">{s.name}</pre>
                        <Form method="post" action ={`execute`} className="inline">
                            <input type="hidden" name="code" value={s.code}/>
                            <button className="text-blue-400  font-medium">Run</button>

                        </Form>
                    </div>
                ))}
            </div>

        </div>
    );
}