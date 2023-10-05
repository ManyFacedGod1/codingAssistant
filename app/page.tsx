'use client';
import useLLM from 'usellm';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function MyComponent() {
  const [userInput, setUserInput] = useState<string>(''); // Define the type of userInput

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmitttt = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Send a POST request to the API route with userInput in the request body
      const response = await fetch('/api/llmservice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (response.ok) {
        console.log('Data sent successfully');
        // Handle success or redirect the user
      } else {
        console.error('Failed to send data');
        // Handle error
      }
    } catch (error) {
      console.error('Error sending data:', error);
      // Handle error
    }
  };
  const llm = useLLM('/api/llmservice');
  const [result, setResult] = useState('');

  const [problem, setProblem] = useState('');
  const [code, setCode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [UserApi, setUserApi] = useState('');

  function handleSubmit() {
    // handleSubmitttt;
    if (!problem) {
      window.alert('Problem statement is required');
      return;
    }

    if (!code) {
      window.alert('Code is required');
      return;
    }

    if (!userInput) {
      window.alert('OpenAI API key is required');
      return;
    }

    llm.chat({
      template: 'leetcode-assistant',
      inputs: {
        problem: problem,
        code: code,
        babluInput: userInput,
        // Include the OpenAI API key here
      },
      stream: true,
      onStream: (message) => setResult(message.content),
      onError: (error) => console.error('Failed to send', error),
    });
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto w-full text-center py-6">
        <div>
          <button
            className="absolute btn right-2"
            onClick={() => {
              const modal = document.getElementById(
                'my_modal_1'
              ) as HTMLDialogElement | null;
              if (modal !== null) {
                modal.showModal();
              } else {
                // Handle the case where the element with the specified ID does not exist.
                console.error('Modal element not found');
              }
            }}
          >
            OPENAI key
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <form>
                <input
                  className="w-full p-4"
                  type="text"
                  value={userInput}
                  // onChange={(e) => setUserInput(e.target.value)}
                  onChange={handleInputChange}
                />
                {/* <button
                  // onClick={handleApiSubmit}
                  // className="w-20 border border-blue-600 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded p-2 font-medium"
                  className="btn"
                  type="submit"
                >
                  Submit
                </button> */}
              </form>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        <h1 className="text-4xl font-semibold">
          CodeCraft - Your LeetCode Companion
        </h1>
        <div className="text-xl text-gray-400 mt-2">
          Instantly improve your code with ChatGPT&apos;s personal programming
          coach. Share your solution for quick feedback.
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto px-4">
        <div className="flex flex-col mb-4">
          <label className="font-medium">Problem Statement</label>
          <textarea
            placeholder="Paste the problem statement here"
            className=" rounded-md border-4 border-gray-50 p-2 mt-1 bg-white"
            rows={5}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-medium">Your Code</label>
          <textarea
            placeholder="Paste your code here"
            className="rounded-md border-4 border-gray-50 p-2 mt-1 font-mono bg-white"
            rows={5}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>
        <div className="m-1  w-full flex justify-center ">
          <button
            onClick={handleSubmit}
            // className="w-20 border border-blue-600 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded p-2 font-medium"
            className="btn  "
          >
            Submit
          </button>
        </div>
      </div>

      {result && (
        <div className="max-w-4xl w-full mx-auto p-4 flex flex-col">
          <label className="font-medium">Assessment</label>
          <div className="text-lg whitespace-pre-wrap ">{result}</div>
        </div>
      )}
    </div>
  );
}
