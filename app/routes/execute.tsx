import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const code = form.get('code') as string;

  try {
    const result = eval(code); 
    return json({ result: String(result) });
  } catch (err) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    return json({ result: `Error: ${message}` });
  }
};
