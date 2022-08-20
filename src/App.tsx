import { FormEvent, useState } from "react";
import "./App.css";
import { generateInterfaceDefinition } from "./interfaces";
import { syntaxHighlight } from "./utils";

const App = () => {
  // messages
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");

  // json text
  const [jsonText, setJsonText] = useState("");
  const [jsonColored, setJsonColored] = useState("");
  const [jsonDefinition, setJsonDefinition] = useState("");

  // takes a json string and generates the json object and shows it
  const generateJson = (jsonText: string) => {
    try {
      setSuccessMessage("");
      setFailureMessage("");
      const jsonParsed = JSON.parse(jsonText.replace(" ", ""));
      const withColor = syntaxHighlight(JSON.stringify(jsonParsed, null, 2));
      const definition = generateInterfaceDefinition(jsonParsed);
      setJsonColored(withColor);
      setJsonDefinition(definition);
    } catch (error) {
      setFailureMessage("Your input was not a valid json");
    }
  };

  // copy the interface definition to the clipboard
  const copyToClipboard = () => {
    if (jsonDefinition.length === 0) {
      setFailureMessage("nothing to copy");
      return;
    }
    try {
      navigator.clipboard.writeText(jsonDefinition);
      setSuccessMessage("copied the interface definition to clipboard.");
    } catch {
      setFailureMessage(
        "could not copy the interface definition  to the clipboard for for some reason"
      );
    }
  };

  // is fired after the text area is changed
  const updateStatus = (e: FormEvent<HTMLTextAreaElement>) => {
    const textArea = e.target as HTMLTextAreaElement;
    setJsonText(textArea.value.trim());
  };

  return (
    <div className="container mx-auto my-5">
      <div className="mx-14">
        {/* Title */}
        <div className="text-bold text-4xl">
          {" "}
          Typescript interface generator
        </div>

        {/* Text area */}
        <div className="my-8">
          <div className="flex flex-row gap-3 content-center items-center my-2">
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Paste your json below
            </label>
          </div>
          <textarea
            id="message"
            rows={15}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your json..."
            onKeyUp={(e) => updateStatus(e)}
          ></textarea>
        </div>

        {/* Actions */}
        <div className="flex flex-row flex-grow gap-3 mb-8">
          <div className="basis-1/2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l w-full disabled:cursor-auto disabled:text-white disabled:bg-gray-300"
              onClick={() => generateJson(jsonText)}
            >
              Generate interface
            </button>
          </div>
          <div className="basis-1/2">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r w-full disabled:cursor-auto disabled:text-white disabled:bg-gray-300"
              onClick={() => copyToClipboard()}
            >
              Copy interface definition to clipboard
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="my-8 text-center font-bold text-lg">
          {/* Success message */}

          <div className="text-green-500"> {successMessage} </div>

          {/* Failure message */}
          <div className="text-red-500"> {failureMessage} </div>
        </div>

        {/* Preview */}
        <div className="flex flex-row flex-grow">
          <div className="basis-1/2">
            <div className="text-bold text-2xl mb-3"> JSON: </div>
            <pre dangerouslySetInnerHTML={{ __html: jsonColored }}></pre>
          </div>

          <div className="basis-1/2">
            {/* Interface definition */}
            <div className="text-bold text-2xl mb-3">Interface definition:</div>
            <pre> {jsonDefinition}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
