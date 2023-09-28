import { NextApiResponse, NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { createLLMService } from 'usellm';

export const runtime = 'edge';

export async function GET(request: Request) {
  return new Response('hello world', { status: 200 });
}
// pages / api / submit - input.js;
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { userInput } = req.body;

//     // Perform backend processing with the userInput
//     console.log('Received User Input:', userInput);

//     // Respond with a JSON message
//     res.status(200).json({ message: 'Data received successfully' });
//   } else {
//     // Handle other HTTP methods if needed
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }

export async function POST(request: Request) {
  const body = await request.json();

  // check if the user is authentication
  // const bablu = body.bab;

  const llmService = createLLMService({
    openaiApiKey: body.inputs.babluInput,
  });

  llmService.registerTemplate({
    id: 'leetcode-assistant',
    systemPrompt:
      'You are a virtual evaluator coding questions. Given a question and some code written by a student, your job is to determine whether the code correctly solves the question. If it\'s correct, simply reply "CORRECT". If it is incorrect, reply "INCORRECT" and in the next few lines, explain why the code is incorrect using bullet points without giving away the answer. Keep your explanations short.',
    userPrompt: `
    PROBLEM:
    {{problem}}

    --END OF PROBLEM--

    MY CODE:
    {{code}}

    --END OF CODE--

    `,
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    max_tokens: 1000,
  });
  // perform some rate limiting

  try {
    const data = await llmService.handle(body);
    return new Response(data, { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 400 });
  }
}
